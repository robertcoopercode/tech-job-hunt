import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { prismaObjectType } from 'nexus-prisma';
import { GraphQLUpload } from 'graphql-upload';
import { stringArg, idArg, intArg, arg, booleanArg, scalarType } from 'nexus';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail, sendEmailConfirmationEmail } from './utils/mail';
import { generateToken } from './utils/generateToken';
import { BillingFrequency } from './generated/prisma-client/index';
import { fileUpload } from './utils/fileUpload';
import { emptyS3Directory } from './utils/emptyS3Directory';
import { deleteS3Files } from './utils/deleteS3File';
import { catchAsyncErrors } from './utils/catchErrors';
import { freeTierJobLimit, cookieDuration } from './utils/constants';
import analytics from './utils/analytics';
import { GraphQLServerContext, stripe } from '.';

const billingFrequencyByPlanId: { [planId: string]: BillingFrequency } = {
    [process.env.COMMON_STRIPE_YEARLY_PLAN_ID]: 'YEARLY',
    [process.env.COMMON_STRIPE_MONTHLY_PLAN_ID]: 'MONTHLY',
};

// TODO: Figure out how to get the file upload types to get passed down to resolvers
// Related: https://github.com/prisma-labs/nexus/issues/113
export const Upload = scalarType({
    name: GraphQLUpload.name,
    asNexusMethod: 'upload', // We set this to be used as a method later as `t.upload()` if needed
    description: GraphQLUpload.description,
    serialize: GraphQLUpload.serialize,
    parseValue: GraphQLUpload.parseValue,
    parseLiteral: GraphQLUpload.parseLiteral,
});

const jobApplicationInputArguments = {
    companyId: idArg(),
    position: stringArg(),
    location: arg({
        type: 'GoogleMapsLocationCreateInput',
        required: false,
    }),
    isCoverLetterUpdated: booleanArg({
        required: true,
    }),
    rating: intArg(),
    jobListingLink: stringArg(),
    jobListingNotes: stringArg(),
    resumeId: stringArg(),
    resumeVersionId: stringArg(),
    coverLetterFile: arg({
        type: 'Upload',
        required: false,
    }),
    isApplicationActive: booleanArg(),
    contacts: arg({
        type: 'JobApplicationContactCreateWithoutJobApplicationInput',
        list: true,
    }),
    applicationStatus: arg({ type: 'ApplicationStatus', required: false }),
    dateApplied: arg({
        type: 'DateTime',
        required: false,
    }),
    dateDecided: arg({
        type: 'DateTime',
        required: false,
    }),
    dateInterviewing: arg({
        type: 'DateTime',
        required: false,
        list: true,
    }),
    dateOffered: arg({
        type: 'DateTime',
        required: false,
    }),
    isRemote: booleanArg(),
    jobDecision: arg({
        type: 'JobDecision',
        required: false,
    }),
    notes: stringArg(),
};

const companyInputArguments = {
    name: stringArg(),
    website: stringArg({
        required: false,
    }),
    rating: intArg({
        required: false,
    }),
    contacts: arg({
        type: 'CompanyContactCreateWithoutCompanyInput',
        list: true,
    }),
    file: arg({
        type: 'Upload',
        required: false,
    }),
    notes: stringArg(),
    isCompanyImageUpdated: booleanArg({
        required: true,
    }),
};

export const Mutation = prismaObjectType<'Mutation'>({
    name: 'Mutation',
    definition(t) {
        t.field('signup', {
            type: 'User',
            args: {
                email: stringArg(),
                password: stringArg(),
                confirmPassword: stringArg(),
            },
            resolve: async (_, { email, password, confirmPassword }, ctx: GraphQLServerContext) => {
                if (password !== confirmPassword) {
                    throw new Error("Passwords don't match!");
                }
                email = email.toLowerCase();
                // Check if user already exists with that email
                const existingUser = await ctx.prisma.user({ email });
                if (existingUser) {
                    if (existingUser.googleId) {
                        throw new Error(`User with that email already exists. Sign in with Google.`);
                    }
                    throw new Error(`User with that email already exists.`);
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const emailConfirmationToken = await generateToken();

                const user = await ctx.prisma.createUser({
                    email,
                    password: hashedPassword,
                    emailConfirmationToken,
                });

                await sendEmailConfirmationEmail(email, emailConfirmationToken);
                const token = jwt.sign({ userId: user.id }, process.env.API_APP_SECRET);

                // NOTE: Need to specify domain in order for front-end to see cookie: https://github.com/apollographql/apollo-client/issues/4193#issuecomment-573195699
                ctx.response.cookie('token', token, {
                    httpOnly: true,
                    maxAge: cookieDuration,
                    domain: process.env.API_COOKIE_DOMAIN,
                });

                analytics.track({ eventType: 'Signup', userId: user.id, eventProperties: { method: 'Password' } });

                return user;
            },
        });
        t.field('login', {
            type: 'User',
            args: { email: stringArg(), password: stringArg() },
            resolve: async (_, { email, password }, ctx: GraphQLServerContext) => {
                email = email.toLowerCase();
                const user = await ctx.prisma.user({ email });
                if (!user) {
                    throw new Error(`No such user found for email ${email}`);
                }
                if (!user.password) {
                    throw new Error(`No password set for that email. Sign in with Google instead.`);
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    throw new Error('Invalid Password!');
                }

                const token = jwt.sign({ userId: user.id }, process.env.API_APP_SECRET);

                ctx.response.cookie('token', token, {
                    httpOnly: true,
                    maxAge: cookieDuration,
                    domain: process.env.API_COOKIE_DOMAIN,
                });

                analytics.track({ eventType: 'Login', userId: user.id, eventProperties: { method: 'Password' } });

                return user;
            },
        });
        t.field('logout', {
            type: 'Boolean',
            resolve: (_, _args, ctx: GraphQLServerContext) => {
                ctx.response.clearCookie('token', {
                    domain: process.env.API_COOKIE_DOMAIN,
                });

                return true;
            },
        });
        t.field('completeOnboarding', {
            type: 'Boolean',
            resolve: async (_, _args, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }
                await ctx.prisma.updateUser({
                    where: { id: ctx.request.userId },
                    data: { hasCompletedOnboarding: true },
                });
                analytics.track({ eventType: 'Onboarding completed', userId: ctx.request.userId });
                return true;
            },
        });
        t.field('requestPasswordReset', {
            type: 'Boolean',
            args: {
                email: stringArg(),
            },
            resolve: async (_, { email }, ctx: GraphQLServerContext) => {
                const user = await ctx.prisma.user({ email });
                if (!user) {
                    throw new Error(`No user found for ${email}`);
                }

                const randomBytesPromisified = promisify(randomBytes);
                const resetToken = (await randomBytesPromisified(20)).toString('hex');
                const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
                await ctx.prisma.updateUser({
                    where: { email },
                    data: { resetToken, resetTokenExpiry },
                });

                // TODO: Prevent sending another email if there is a resetTokenExpiry that is not yet expired because this email reset feature could
                // be abused by bots.
                await sendEmail({
                    subject: 'Your password reset token',
                    toAddress: [user.email],
                    text: `Your Password Reset Token is here!
                \n\n
                <a href="${process.env.COMMON_FRONTEND_URL}/reset-password?resetToken=${resetToken}">Click Here to Reset</a>`,
                });

                analytics.track({ eventType: 'Reset password request' });

                return true;
            },
        });
        t.field('resetPassword', {
            type: 'User',
            args: {
                password: stringArg(),
                confirmPassword: stringArg(),
                resetToken: stringArg(),
            },
            resolve: async (_, { password, confirmPassword, resetToken }, ctx: GraphQLServerContext) => {
                if (password !== confirmPassword) {
                    throw new Error("Passwords don't match!");
                }
                const [user] = await ctx.prisma.users({
                    where: {
                        resetToken: resetToken,
                        resetTokenExpiry_gte: Date.now() - 3600000,
                    },
                });
                if (!user) {
                    throw new Error('This token is either invalid or expired!');
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const updatedUser = await ctx.prisma.updateUser({
                    where: { email: user.email },
                    data: {
                        password: hashedPassword,
                        resetToken: null,
                        resetTokenExpiry: null,
                    },
                });

                const token = jwt.sign({ userId: updatedUser.id }, process.env.API_APP_SECRET);

                ctx.response.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    domain: process.env.API_COOKIE_DOMAIN,
                });

                analytics.track({ eventType: 'Reset password success' });

                return updatedUser;
            },
        });
        t.field('requestVerifyEmail', {
            type: 'Boolean',
            resolve: async (_, _args, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }
                const emailConfirmationToken = await generateToken();
                const userEmail = await ctx.prisma.user({ id: ctx.request.userId }).email();
                await ctx.prisma.updateUser({
                    where: {
                        email: userEmail,
                    },
                    data: {
                        emailConfirmationToken,
                    },
                });

                await sendEmailConfirmationEmail(userEmail, emailConfirmationToken);

                analytics.track({ eventType: 'Request verify email', userId: ctx.request.userId });

                return true;
            },
        });
        t.field('verifyEmail', {
            type: 'Boolean',
            args: {
                emailToken: stringArg(),
            },
            resolve: async (_, { emailToken }, ctx: GraphQLServerContext) => {
                const [user] = await ctx.prisma.users({
                    where: {
                        emailConfirmationToken: emailToken,
                    },
                });

                if (!user) {
                    throw new Error('This token is either invalid or expired!');
                }

                await ctx.prisma.updateUser({
                    where: { email: user.email },
                    data: {
                        emailConfirmationToken: null,
                        hasVerifiedEmail: true,
                    },
                });

                analytics.track({ eventType: 'Email verified' });

                return true;
            },
        });
        t.field('deleteAccount', {
            type: 'User',
            resolve: async (_, _args, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }
                // Delete all data for the user in S3
                await emptyS3Directory(`users/${ctx.request.userId}`);

                // Delete the user in the database using Prisma (will trigger a cascading delete of all user data)
                const deletedUser = await ctx.prisma.deleteUser({ id: ctx.request.userId });

                analytics.track({ eventType: 'Account deleted', userId: ctx.request.userId });

                return deletedUser;
            },
        });
        t.field('cancelSubscription', {
            type: 'User',
            resolve: async (_, _args, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }

                return catchAsyncErrors(async () => {
                    const stripeCustomerId = await ctx.prisma
                        .user({ id: ctx.request.userId })
                        .billing()
                        .stripeCustomerId();

                    // Get current subscription
                    const currentSubscription = await stripe.subscriptions.list({
                        customer: stripeCustomerId,
                        limit: 1,
                        status: 'active',
                    });

                    const subscriptionId = currentSubscription.data[0].id;

                    // Update the current subscription to cancel at the end of the period
                    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
                        cancel_at_period_end: true,
                    });

                    const updatedUser = await ctx.prisma.updateUser({
                        where: { id: ctx.request.userId },
                        data: {
                            billing: {
                                update: {
                                    willCancelAtEndOfPeriod: updatedSubscription.cancel_at_period_end,
                                },
                            },
                        },
                    });

                    analytics.track({ eventType: 'Subscription cancelled', userId: ctx.request.userId });

                    return updatedUser;
                });
            },
        });
        t.field('updateCreditCard', {
            type: 'User',
            args: {
                card: arg({
                    type: 'CardUpdateWithoutBillingInfoDataInput',
                    required: true,
                }),
            },
            resolve: async (_, { card }, ctx: GraphQLServerContext) => {
                const { expMonth, expYear, last4Digits, brand, stripePaymentMethodId } = card;

                if (!ctx.request.userId) {
                    return;
                }

                return catchAsyncErrors(async () => {
                    const stripeCustomerId = await ctx.prisma
                        .user({ id: ctx.request.userId })
                        .billing()
                        .stripeCustomerId();

                    // Attach the new payment method with the current user in stripe
                    await stripe.paymentMethods.attach(stripePaymentMethodId, { customer: stripeCustomerId });
                    // Update the customer's default payment method in stripe
                    await stripe.customers.update(stripeCustomerId, {
                        invoice_settings: {
                            default_payment_method: stripePaymentMethodId,
                        },
                    });

                    const updatedUser = await ctx.prisma.updateUser({
                        where: { id: ctx.request.userId },
                        data: {
                            billing: {
                                update: {
                                    card: {
                                        update: {
                                            expMonth,
                                            expYear,
                                            last4Digits,
                                            brand,
                                            stripePaymentMethodId,
                                        },
                                    },
                                },
                            },
                        },
                    });

                    analytics.track({ eventType: 'Credit card updated', userId: ctx.request.userId });

                    return updatedUser;
                });
            },
        }),
            t.field('upgradeUser', {
                type: 'StripeSubscription',
                args: {
                    paymentMethodId: stringArg(),
                    email: stringArg(),
                    planId: stringArg(),
                    card: arg({
                        type: 'CardUpdateWithoutBillingInfoDataInput',
                        required: true,
                    }),
                },
                resolve: async (_, { paymentMethodId, email, planId, card }, ctx: GraphQLServerContext) => {
                    if (!ctx.request.userId) {
                        throw Error('No userId present');
                    }

                    // Make sure the plan ID is valid
                    if (
                        planId !== process.env.COMMON_STRIPE_YEARLY_PLAN_ID &&
                        planId !== process.env.COMMON_STRIPE_MONTHLY_PLAN_ID
                    ) {
                        throw Error('Unknown planId');
                    }

                    return catchAsyncErrors(async () => {
                        // Look if current user already has a stripe customer ID before trying to create a new customer in Stripe
                        const billingInfo = await ctx.prisma.user({ id: ctx.request.userId }).billing();
                        const cardDetails = await ctx.prisma
                            .user({ id: ctx.request.userId })
                            .billing()
                            .card();
                        let stripeCustomerId, brand, expMonth, expYear, last4Digits, stripePaymentMethodId;

                        if (cardDetails) {
                            ({ brand, expMonth, expYear, last4Digits, stripePaymentMethodId } = cardDetails);
                        }

                        if (billingInfo) {
                            ({ stripeCustomerId } = billingInfo);
                        }

                        // If the user is already premium, then return early to prevent charging them for a new subscription
                        if (billingInfo && billingInfo.isPremiumActive) {
                            throw Error('User is already on a premium membership');
                        }

                        // If the user doesn't have a stripe customer ID, create one
                        if (!stripeCustomerId) {
                            // This creates a new Customer in Stripe and attaches the PaymentMethod in one API call.
                            const customer = await stripe.customers.create({
                                payment_method: paymentMethodId,
                                email: email,
                                invoice_settings: {
                                    default_payment_method: paymentMethodId,
                                },
                            });
                            // Set the card details variables to what was provided through the GraphQL request
                            ({ expMonth, expYear, last4Digits, brand } = card);
                            stripeCustomerId = customer.id;
                        } else {
                            // If the current payment method (i.e. card) is not the same as the one associated with the user, then make sure to update the default payment method
                            if (stripePaymentMethodId !== undefined && stripePaymentMethodId !== paymentMethodId) {
                                await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });
                                await stripe.customers.update(stripeCustomerId, {
                                    invoice_settings: {
                                        default_payment_method: paymentMethodId,
                                    },
                                });
                            }
                        }

                        // Store the Stripe custom ID in our database
                        await ctx.prisma.updateUser({
                            where: { id: ctx.request.userId },
                            data: {
                                billing: {
                                    upsert: {
                                        create: {
                                            stripeCustomerId,
                                        },
                                        update: {
                                            stripeCustomerId,
                                        },
                                    },
                                },
                            },
                        });

                        // Create the subscription
                        const subscription = await stripe.subscriptions.create({
                            customer: stripeCustomerId,
                            items: [{ plan: planId }],
                            expand: ['latest_invoice.payment_intent'],
                        });

                        const isSubscriptionPaymentConfirmed =
                            typeof subscription.latest_invoice === 'object' &&
                            typeof subscription.latest_invoice.payment_intent === 'object' &&
                            subscription.latest_invoice.payment_intent.status === 'succeeded';

                        // Store stripe subscription details in database
                        await ctx.prisma.updateUser({
                            where: { id: ctx.request.userId },
                            data: {
                                billing: {
                                    upsert: {
                                        create: {
                                            stripeCustomerId: stripeCustomerId,
                                            stripeSubscriptionId: subscription.id,
                                            startOfBillingPeriod: subscription.current_period_start,
                                            endOfBillingPeriod: subscription.current_period_end,
                                            isPremiumActive: isSubscriptionPaymentConfirmed,
                                            billingFrequency: billingFrequencyByPlanId[planId],
                                            card: {
                                                create: {
                                                    expMonth,
                                                    expYear,
                                                    last4Digits,
                                                    brand,
                                                    stripePaymentMethodId: paymentMethodId,
                                                },
                                            },
                                        },
                                        update: {
                                            stripeCustomerId: stripeCustomerId,
                                            stripeSubscriptionId: subscription.id,
                                            startOfBillingPeriod: subscription.current_period_start,
                                            endOfBillingPeriod: subscription.current_period_end,
                                            isPremiumActive: isSubscriptionPaymentConfirmed,
                                            billingFrequency: billingFrequencyByPlanId[planId],
                                            card: {
                                                upsert: {
                                                    create: {
                                                        expMonth,
                                                        expYear,
                                                        last4Digits,
                                                        brand,
                                                        stripePaymentMethodId: paymentMethodId,
                                                    },
                                                    update: {
                                                        expMonth,
                                                        expYear,
                                                        last4Digits,
                                                        brand,
                                                        stripePaymentMethodId: paymentMethodId,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        });

                        if (isSubscriptionPaymentConfirmed) {
                            analytics.track({
                                eventType: 'Premium upgrade',
                                userId: ctx.request.userId,
                                eventProperties: {
                                    billingFrequency: billingFrequencyByPlanId[planId],
                                },
                            });
                        }
                        // eslint-disable-next-line no-console
                        console.log('Created stripe subscription', { subscription });

                        if (
                            typeof subscription.latest_invoice === 'object' &&
                            typeof subscription.latest_invoice.payment_intent === 'object'
                        ) {
                            return {
                                status: subscription.latest_invoice.payment_intent.status,
                                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                            };
                        }

                        throw new Error('Unable to retrieve Stripe subscription information');
                    });
                },
            });
        t.field('checkSubscriptionPaymentHasSucceeded', {
            type: 'Boolean',
            resolve: async (_, __, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }
                const stripeSubscriptionId = await ctx.prisma
                    .user({ id: ctx.request.userId })
                    .billing()
                    .stripeSubscriptionId();
                const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
                    expand: ['latest_invoice.payment_intent'],
                });

                const isSubscriptionPaymentConfirmed =
                    typeof subscription.latest_invoice === 'object' &&
                    typeof subscription.latest_invoice.payment_intent === 'object' &&
                    subscription.latest_invoice.payment_intent.status === 'succeeded';

                await ctx.prisma.updateUser({
                    where: { id: ctx.request.userId },
                    data: {
                        billing: {
                            update: {
                                isPremiumActive: isSubscriptionPaymentConfirmed,
                            },
                        },
                    },
                });

                if (isSubscriptionPaymentConfirmed) {
                    analytics.track({
                        eventType: 'Premium upgrade',
                        userId: ctx.request.userId,
                        eventProperties: {
                            billingFrequency: billingFrequencyByPlanId[subscription.plan.id],
                        },
                    });
                }

                return isSubscriptionPaymentConfirmed;
            },
        });
        t.field('deleteJobApplication', {
            type: 'JobApplication',
            args: {
                jobId: idArg(),
            },
            resolve: async (_, { jobId }, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }
                const jobApplicationUser = await ctx.prisma.jobApplication({ id: jobId }).user();
                if (jobApplicationUser.id !== ctx.request.userId) {
                    return;
                }
                const companyId = await ctx.prisma
                    .jobApplication({ id: jobId })
                    .company()
                    .id();
                const jobApplicationCoverLetter = await ctx.prisma.jobApplication({ id: jobId }).coverLetterFile();
                const deletedJobApplication = await ctx.prisma.deleteJobApplication({ id: jobId });

                // Delete cover letter from S3
                if (jobApplicationCoverLetter) {
                    await deleteS3Files({
                        key: jobApplicationCoverLetter.Key,
                        versionIds: [jobApplicationCoverLetter.VersionId],
                    });
                }

                // Set the jobApplicationsCount to the updated value on the company
                if (deletedJobApplication) {
                    const count = await ctx.prisma
                        .jobApplicationsConnection({
                            where: { company: { id: companyId } },
                        })
                        .aggregate()
                        .count();
                    await ctx.prisma.updateCompany({
                        where: { id: companyId },
                        data: { jobApplicationsCount: count },
                    });
                }

                analytics.track({
                    eventType: 'Job application deleted',
                    userId: ctx.request.userId,
                    eventProperties: {
                        id: jobId,
                    },
                });

                return deletedJobApplication;
            },
        });
        t.field('deleteCompany', {
            type: 'Company',
            args: {
                id: idArg(),
            },
            resolve: async (_, { id }, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }

                const companyUser = await ctx.prisma.company({ id }).user();
                if (companyUser.id !== ctx.request.userId) {
                    return;
                }

                const companyImage = await ctx.prisma.company({ id }).image();
                const deletedCompany = await ctx.prisma.deleteCompany({ id });

                if (companyImage) {
                    // Delete all company images from S3, including all resized images
                    const match = companyImage.s3Url.match(/.*\.amazonaws.com\/(.*\/companies\/[^\/]*)\/.*/);
                    if (match) {
                        await emptyS3Directory(match[1]);
                    }
                }

                analytics.track({
                    eventType: 'Company deleted',
                    userId: ctx.request.userId,
                    eventProperties: {
                        id,
                    },
                });

                return deletedCompany;
            },
        });
        t.field('deleteResume', {
            type: 'Resume',
            args: {
                id: idArg(),
            },
            resolve: async (_, { id }, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }
                const resumeUser = await ctx.prisma.resume({ id }).user();
                if (resumeUser.id !== ctx.request.userId) {
                    return;
                }
                const awsFileVersions = await ctx.prisma.resume({ id }).versions();
                const deletedResume = await ctx.prisma.deleteResume({ id });

                // Delete file from S3
                await deleteS3Files({
                    key: awsFileVersions[0].Key,
                    versionIds: awsFileVersions.map(resume => resume.VersionId),
                });

                analytics.track({
                    eventType: 'Resume deleted',
                    userId: ctx.request.userId,
                    eventProperties: {
                        id,
                    },
                });

                return deletedResume;
            },
        });
        t.field('createCompany', {
            type: 'Company',
            args: {
                name: companyInputArguments['name'],
                file: companyInputArguments['file'],
            },
            resolve: async (_, { name, file }, ctx: GraphQLServerContext) => {
                const { userId } = ctx.request;
                if (!userId) {
                    return;
                }
                return catchAsyncErrors(async () => {
                    const awsFileData = await fileUpload({ userId, filePathPrefix: `companies`, file });

                    // Then create the company entry in Prisma, storing the S3 file info
                    const createdCompany = await ctx.prisma.createCompany({
                        user: { connect: { id: userId } },
                        name,
                        image: { create: awsFileData },
                    });

                    analytics.track({
                        eventType: 'Company created',
                        userId: ctx.request.userId,
                        eventProperties: {
                            id: createdCompany.id,
                        },
                    });

                    return createdCompany;
                });
            },
        });
        t.field('updateCompany', {
            type: 'Company',
            args: {
                ...companyInputArguments,
                id: idArg({ required: true }),
            },
            resolve: async (
                _,
                { id, name, website, rating, notes, file, contacts, isCompanyImageUpdated },
                ctx: GraphQLServerContext
            ) => {
                const { userId } = ctx.request;
                if (!userId) {
                    return;
                }
                return catchAsyncErrors(async () => {
                    // Verify user is associated with the company they are trying to update
                    const companyUser = await ctx.prisma.company({ id }).user();
                    if (companyUser.id !== userId) {
                        throw Error('Company is not associated with current user');
                    }

                    // Variable that will hold new cover letter AWS info if there is a new cover letter updated by the user
                    let companyImageAwsFileData;

                    const existingCompanyImage = await ctx.prisma.company({ id }).image();
                    const existingCompanyName = await ctx.prisma.company({ id }).name();

                    // If changing the company name, update the `companyName` field on all job applications associated with the company
                    if (existingCompanyName !== name) {
                        await ctx.prisma.updateManyJobApplications({
                            where: { company: { id } },
                            data: { companyName: name },
                        });
                    }

                    // If there is already an existing company image and it has been updated in the front-end,
                    // make sure to delete the existing image from S3 before uploading a new one
                    if (existingCompanyImage && isCompanyImageUpdated) {
                        // Delete all company images from S3, including all resized images, before uploading new image
                        const match = existingCompanyImage.s3Url.match(
                            /.*\.amazonaws.com\/(.*\/companies\/[^\/]*)\/.*/
                        );
                        if (match) {
                            await emptyS3Directory(match[1]);
                        }
                    }

                    // Upload new cover letter to AWS if the cover letter has been updated by the user
                    if (isCompanyImageUpdated) {
                        companyImageAwsFileData = await fileUpload({
                            userId,
                            filePathPrefix: `companies`,
                            file,
                        });
                    }

                    const currentContacts = await ctx.prisma.companyContacts({
                        where: { company: { id } },
                    });
                    const contactIdsToDelete = currentContacts.reduce((prev: string[], curr) => {
                        if (curr.id && contacts.every(contact => contact.id !== curr.id)) {
                            prev.push(curr.id);
                        }
                        return prev;
                    }, []);
                    const contactsToUpdate = contacts.filter(contact => currentContacts.some(c => c.id === contact.id));
                    const contactsToCreate = contacts.filter(contact =>
                        currentContacts.every(c => c.id !== contact.id)
                    );

                    // Then create the company entry in Prisma, storing the S3 file info
                    const updatedCompany = await ctx.prisma.updateCompany({
                        where: {
                            id,
                        },
                        data: {
                            name,
                            website,
                            rating,
                            notes,
                            contacts: {
                                ...(contactsToUpdate.length
                                    ? {
                                          updateMany: contactsToUpdate.map(contact => {
                                              const { id, ...data } = contact;
                                              return {
                                                  where: {
                                                      id,
                                                  },
                                                  data,
                                              };
                                          }),
                                      }
                                    : {}),
                                ...(contactsToCreate.length ? { create: contactsToCreate } : {}),
                                ...(contactIdsToDelete.length
                                    ? {
                                          deleteMany: {
                                              id_in: contactIdsToDelete,
                                          },
                                      }
                                    : {}),
                            },
                            image: {
                                ...(companyImageAwsFileData
                                    ? {
                                          upsert: {
                                              create: companyImageAwsFileData,
                                              update: companyImageAwsFileData,
                                          },
                                      }
                                    : {}),
                                delete: isCompanyImageUpdated && file === undefined,
                            },
                        },
                    });

                    analytics.track({
                        eventType: 'Company updated',
                        userId: ctx.request.userId,
                        eventProperties: {
                            id: id,
                        },
                    });

                    return updatedCompany;
                });
            },
        });
        t.field('createResume', {
            type: 'Resume',
            args: {
                name: stringArg(),
                file: arg({
                    type: 'Upload',
                    required: false,
                }),
            },
            resolve: async (root, { name, file }, ctx: GraphQLServerContext) => {
                const { userId } = ctx.request;
                if (!userId) {
                    return;
                }
                try {
                    const awsFileData = await fileUpload({ userId, filePathPrefix: `resumes`, file, isImage: false });

                    const createdResume = await ctx.prisma.createResume({
                        user: { connect: { id: userId } },
                        name,
                        versions: {
                            create: awsFileData,
                        },
                    });

                    analytics.track({
                        eventType: 'Resume created',
                        userId: ctx.request.userId,
                        eventProperties: {
                            id: createdResume.id,
                        },
                    });

                    return createdResume;
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }
            },
        });
        t.field('updateResume', {
            type: 'Resume',
            args: {
                id: idArg(),
                name: stringArg(),
                newFileVersion: arg({
                    type: 'Upload',
                    required: false,
                }),
            },
            resolve: async (root, { id, name, newFileVersion }, ctx: GraphQLServerContext) => {
                const { userId } = ctx.request;
                if (!userId) {
                    return;
                }
                try {
                    // Verify user is associated with the company they are trying to update
                    const result = await ctx.prisma.resumes({
                        where: { user: { id: userId }, id },
                    });
                    const resumeVersions = await ctx.prisma.resume({ id: result[0].id }).versions();
                    const awsFileData = await fileUpload({
                        userId,
                        filePathPrefix: `resumes`,
                        file: newFileVersion,
                        existingObjectKey: resumeVersions[0].Key,
                        isImage: false,
                    });

                    const updatedResume = await ctx.prisma.updateResume({
                        where: {
                            id: result[0].id,
                        },
                        data: {
                            versions: {
                                create: awsFileData,
                            },
                            name,
                        },
                    });

                    analytics.track({
                        eventType: 'Resume updated',
                        userId: ctx.request.userId,
                        eventProperties: {
                            id,
                        },
                    });

                    return updatedResume;
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }
            },
        });
        t.field('createJobApplication', {
            type: 'JobApplication',
            args: {
                companyId: jobApplicationInputArguments['companyId'],
                position: jobApplicationInputArguments['position'],
                location: jobApplicationInputArguments['location'],
                isRemote: jobApplicationInputArguments['isRemote'],
            },
            resolve: async (_, { companyId, position, location, isRemote }, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return;
                }

                return catchAsyncErrors(async () => {
                    const isPremium = await ctx.prisma
                        .user({ id: ctx.request.userId })
                        .billing()
                        .isPremiumActive();

                    if (!isPremium) {
                        const jobApplicationsCount = await ctx.prisma
                            .jobApplicationsConnection({
                                where: { user: { id: ctx.request.userId } },
                            })
                            .aggregate()
                            .count();
                        if (jobApplicationsCount !== undefined && jobApplicationsCount > freeTierJobLimit) {
                            throw Error('User cannot add new job since free tier limit has been reached.');
                        }
                    }

                    const companyName = await ctx.prisma.company({ id: companyId }).name();

                    const newJobApplication = await ctx.prisma.createJobApplication({
                        user: { connect: { id: ctx.request.userId } },
                        company: { connect: { id: companyId } },
                        isRemote: isRemote,
                        companyName,
                        position,
                        locationName: location && location.name,
                        ...(location
                            ? {
                                  location: {
                                      create: {
                                          googlePlacesId: location.googlePlacesId,
                                          name: location.name,
                                      },
                                  },
                              }
                            : {}),
                    });
                    // Set the jobApplicationsCount to the updated value on the company
                    if (newJobApplication) {
                        const count = await ctx.prisma
                            .jobApplicationsConnection({
                                where: { company: { id: companyId } },
                            })
                            .aggregate()
                            .count();
                        await ctx.prisma
                            .updateCompany({
                                where: { id: companyId },
                                data: { jobApplicationsCount: count },
                            })
                            .jobApplicationsCount();
                    }
                    analytics.track({
                        eventType: 'Job application created',
                        userId: ctx.request.userId,
                        eventProperties: {
                            id: newJobApplication.id,
                        },
                    });
                    return newJobApplication;
                });
            },
        });
        t.field('updateJobApplication', {
            type: 'JobApplication',
            args: {
                id: idArg({ required: true }),
                ...jobApplicationInputArguments,
            },
            resolve: async (
                _,
                {
                    id,
                    companyId,
                    position,
                    location,
                    rating,
                    jobListingLink,
                    jobListingNotes,
                    contacts,
                    resumeId,
                    resumeVersionId,
                    coverLetterFile,
                    isCoverLetterUpdated,
                    isApplicationActive,
                    applicationStatus,
                    dateApplied,
                    dateDecided,
                    dateInterviewing,
                    dateOffered,
                    isRemote,
                    jobDecision,
                    notes,
                },
                ctx: GraphQLServerContext
            ) => {
                const { userId } = ctx.request;
                if (!userId) {
                    return;
                }
                return catchAsyncErrors(async () => {
                    const isPremium = await ctx.prisma
                        .user({ id: ctx.request.userId })
                        .billing()
                        .isPremiumActive();

                    if (!isPremium) {
                        const jobApplicationsCount = await ctx.prisma
                            .jobApplicationsConnection({
                                where: { user: { id: ctx.request.userId } },
                            })
                            .aggregate()
                            .count();
                        if (jobApplicationsCount !== undefined && jobApplicationsCount > freeTierJobLimit) {
                            throw Error('User cannot update job since free tier limit has been reached.');
                        }
                    }

                    // Verify user is associated with the company they are trying to update
                    const jobApplicationUser = await ctx.prisma.jobApplication({ id }).user();
                    if (jobApplicationUser.id !== userId) {
                        throw Error('Job application is not associated with current user');
                    }

                    // Variable that will hold new cover letter AWS info if there is a new cover letter updated by the user
                    let coverLetterAwsFileData;

                    const existingCoverLetter = await ctx.prisma.jobApplication({ id }).coverLetterFile();

                    // If there is already an existing cover letter and it has been updated in the front-end,
                    // make sure to delete the existing cover letter from S3 before uploading a new one
                    if (existingCoverLetter && isCoverLetterUpdated) {
                        await deleteS3Files({
                            key: existingCoverLetter.Key,
                            versionIds: [existingCoverLetter.VersionId],
                        });
                    }

                    // Upload new cover letter to AWS if the cover letter has been updated by the user
                    if (isCoverLetterUpdated) {
                        coverLetterAwsFileData = await fileUpload({
                            userId,
                            filePathPrefix: `coverLetters`,
                            file: coverLetterFile,
                            isImage: false,
                        });
                    }

                    const currentContacts = await ctx.prisma.jobApplicationContacts({
                        where: { jobApplication: { id } },
                    });
                    const contactIdsToDelete = currentContacts.reduce((prev: string[], curr) => {
                        if (curr.id && contacts.every(contact => contact.id !== curr.id)) {
                            prev.push(curr.id);
                        }
                        return prev;
                    }, []);
                    const contactsToUpdate = contacts.filter(contact => currentContacts.some(c => c.id === contact.id));
                    const contactsToCreate = contacts.filter(contact =>
                        currentContacts.every(c => c.id !== contact.id)
                    );

                    let existingLocation;

                    if (location && location.id) {
                        existingLocation = await ctx.prisma.googleMapsLocation({ id: location.id });
                    }

                    const existingCompanyId = await ctx.prisma
                        .jobApplication({ id })
                        .company()
                        .id();

                    const companyName = await ctx.prisma.company({ id: companyId }).name();

                    const updateJobApplication = await ctx.prisma.updateJobApplication({
                        where: {
                            id,
                        },
                        data: {
                            company: { connect: { id: companyId } },
                            position,
                            location: {
                                create:
                                    existingLocation || !location
                                        ? undefined
                                        : { googlePlacesId: location.googlePlacesId, name: location.name },
                                delete: existingLocation ? location === null : undefined,
                            },
                            locationName: location && location.name,
                            rating,
                            jobListingLink,
                            jobListingNotes,
                            companyName,
                            applicationStatus,
                            dateApplied,
                            dateDecided,
                            dateInterviewing: {
                                set: dateInterviewing.filter(date => date !== ''),
                            },
                            dateOffered,
                            isRemote,
                            jobDecision,
                            notes,
                            contacts: {
                                ...(contactsToUpdate.length
                                    ? {
                                          updateMany: contactsToUpdate.map(contact => {
                                              const { id, ...data } = contact;
                                              return {
                                                  where: {
                                                      id,
                                                  },
                                                  data,
                                              };
                                          }),
                                      }
                                    : {}),
                                ...(contactsToCreate.length ? { create: contactsToCreate } : {}),
                                ...(contactIdsToDelete.length
                                    ? {
                                          deleteMany: {
                                              id_in: contactIdsToDelete,
                                          },
                                      }
                                    : {}),
                            },
                            resume: {
                                ...(resumeId
                                    ? {
                                          upsert: {
                                              create: {
                                                  resume: {
                                                      connect: {
                                                          id: resumeId,
                                                      },
                                                  },
                                                  selectedVersionId: resumeVersionId,
                                              },
                                              update: {
                                                  resume: {
                                                      connect: {
                                                          id: resumeId,
                                                      },
                                                  },
                                                  selectedVersionId: resumeVersionId,
                                              },
                                          },
                                      }
                                    : {}),
                                disconnect: resumeId === null,
                            },
                            coverLetterFile: {
                                ...(coverLetterAwsFileData
                                    ? {
                                          upsert: {
                                              create: coverLetterAwsFileData,
                                              update: coverLetterAwsFileData,
                                          },
                                      }
                                    : {}),
                                delete: isCoverLetterUpdated && coverLetterFile === undefined,
                            },
                            isApplicationActive,
                        },
                    });

                    // If the company changed, make sure to update the jobApplicationsCount field on both companies
                    if (existingCompanyId !== companyId) {
                        const previousCompanyCount = await ctx.prisma
                            .jobApplicationsConnection({
                                where: { company: { id: existingCompanyId } },
                            })
                            .aggregate()
                            .count();
                        const newCompanyCount = await ctx.prisma
                            .jobApplicationsConnection({
                                where: { company: { id: companyId } },
                            })
                            .aggregate()
                            .count();
                        await ctx.prisma.updateCompany({
                            where: { id: companyId },
                            data: { jobApplicationsCount: newCompanyCount },
                        });
                        await ctx.prisma.updateCompany({
                            where: { id: companyId },
                            data: { jobApplicationsCount: previousCompanyCount },
                        });
                    }

                    analytics.track({
                        eventType: 'Job application updated',
                        userId: ctx.request.userId,
                        eventProperties: {
                            id,
                        },
                    });

                    return updateJobApplication;
                });
            },
        });
    },
});
