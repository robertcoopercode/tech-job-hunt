// Used to load .env for local development. Will not be used when app is deployed to Zeit now since Zeit does not deploy the .env file.
require('dotenv-flow').config();

import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma';
import { GraphQLServer } from 'graphql-yoga';
import passport from 'passport';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { Request } from 'express';
import Stripe, { events, invoices, customers } from 'stripe';
import datamodelInfo from './generated/nexus-prisma';
import { prisma, Prisma } from './generated/prisma-client';
import { passportAuthentication, passportAuthenticationCallback, authenticationStrategy } from './utils/auth';
import { Query, JobApplicationConnection, CompanyConnection, ResumeConnection } from './Query';
import { Mutation, Upload } from './Mutation';
import { StripeSubscription } from './CustomType';
import analytics from './utils/analytics';

export const stripe = new Stripe('sk_test_WEEHCPAAw4mYtS71SZcQ9LCn00VuDg7wVY');

// Makes sure that it's truly Stripe making the API calls the the /stripe endpoint
const stripeWebhookSecret = process.env.API_STRIPE_WEBHOOK_SECRET;

export const BatchPayload = prismaObjectType({
    name: 'BatchPayload',
    definition: t => t.prismaFields(['*']),
});

const schema = makePrismaSchema({
    types: [
        Query,
        Mutation,
        BatchPayload,
        StripeSubscription,
        JobApplicationConnection,
        CompanyConnection,
        ResumeConnection,
        Upload,
    ],
    prisma: {
        datamodelInfo,
        client: prisma,
    },
    outputs: {
        schema: path.join(__dirname, './generated/schema.graphql'),
        typegen: path.join(__dirname, './generated/nexus.ts'),
    },
});

export type GraphQLServerContext = {
    prisma: Prisma;
} & ContextParameters & { request: Request & { userId?: string } };

const server = new GraphQLServer({
    schema,
    context: (contextParams): GraphQLServerContext => ({
        prisma,
        ...contextParams,
    }),
});

const handleStripeWebhook = async (request, response): Promise<void> => {
    const sig = request.headers['stripe-signature'];

    let event: events.IEvent;

    // Verify that stripe made the API call
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, stripeWebhookSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'invoice.payment_succeeded':
            // eslint-disable-next-line no-console
            console.log('Upgrading user to premium tier');
            const setIsPremiumData = event.data.object as invoices.IInvoice;
            if (setIsPremiumData.customer && typeof setIsPremiumData.customer === 'string') {
                // Make sure there is a user associated with the stripe ID, otherwise make sure to create/update the billing info
                // of of user with the customer ID provided by stripe. This happens when gifting people premium memberships through
                // the stripe UI
                const billingInfo = await prisma.billingInfo({ stripeCustomerId: setIsPremiumData.customer });
                if (billingInfo === null) {
                    await prisma.createBillingInfo({
                        user: { connect: { email: setIsPremiumData.customer_email } },
                        stripeCustomerId: setIsPremiumData.customer,
                    });
                }
                await prisma.updateBillingInfo({
                    where: { stripeCustomerId: setIsPremiumData.customer },
                    data: {
                        isPremiumActive: true,
                    },
                });
                analytics.track({
                    eventType: 'Invoice paid',
                    eventProperties: {
                        stripeCustomerId: setIsPremiumData.customer,
                    },
                });
            }
            break;
        case 'invoice.payment_failed':
        case 'subscription_schedule.canceled':
        case 'customer.subscription.deleted':
            // eslint-disable-next-line no-console
            console.log('Downgrading user to free tier');
            const unsetIsPremiumData = event.data.object as invoices.IInvoice;
            if (unsetIsPremiumData.customer && typeof unsetIsPremiumData.customer === 'string') {
                await prisma.updateBillingInfo({
                    where: { stripeCustomerId: unsetIsPremiumData.customer },
                    data: {
                        isPremiumActive: false,
                        billingFrequency: null,
                        card: null,
                        endOfBillingPeriod: null,
                        startOfBillingPeriod: null,
                        stripeSubscriptionId: null,
                        willCancelAtEndOfPeriod: false,
                    },
                });
                analytics.track({
                    eventType: 'Downgrading user to free tier',
                    eventProperties: {
                        stripeCustomerId: unsetIsPremiumData.customer,
                    },
                });
            }
            break;
        case 'customer.deleted':
            // eslint-disable-next-line no-console
            console.log('Downgrading user to free tier');
            const unsetCustomerData = event.data.object as customers.ICustomer;
            if (unsetCustomerData.id) {
                await prisma.deleteBillingInfo({
                    stripeCustomerId: unsetCustomerData.id,
                });
            }
            analytics.track({
                eventType: 'Downgrading user to free tier',
                eventProperties: {
                    stripeCustomerId: unsetCustomerData.id,
                },
            });
            break;
        default:
            // Unexpected event type
            return response.status(400).end();
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};

server.express.use(cookieParser());
server.express.use(
    session({
        secret: process.env.API_APP_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Authentication
passport.use(authenticationStrategy(prisma));
// Make the user object accessible through `req.user`
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

server.express.use(passport.initialize());
server.express.use(passport.session());
server.express.get('/auth/google', passportAuthentication(passport));
server.express.get('/auth/google/callback', passportAuthenticationCallback(passport));
// Stripe webhook endpoint
server.express.post('/stripe', bodyParser.raw({ type: 'application/json' }), handleStripeWebhook);

// decode the JWT so we can get the user Id on each request
server.express.use((req: any, res, next) => {
    const { token } = req.cookies;
    if (token) {
        try {
            const { userId } = jwt.verify(token, process.env.API_APP_SECRET) as any;
            // put the userId onto the req for future requests to access
            req.userId = userId;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.message);
            // If the JWT is invalid remove the cookie in the response so the front-end redirects
            // the user to the login page
            res.clearCookie('token', {
                domain: process.env.API_COOKIE_DOMAIN,
            });
        }
    }
    next();
});

// Middleware that populates the user on each request
server.express.use(async (req: any, res, next) => {
    // if they aren't logged in, skip this
    if (!req.userId) {
        return next();
    }
    const user = await prisma.user({ id: req.userId });
    req.user = user;
    next();
});

// Express error handler
server.express.use((err, req, res, _next) => {
    if (res.locals.errorType === 'AuthenticationError') {
        // eslint-disable-next-line no-console
        console.log('Authentication error', err);
        const queryString = `authError=true`;
        res.redirect(`${process.env.COMMON_FRONTEND_URL}/login?${queryString}`);
    } else {
        // eslint-disable-next-line no-console
        console.log('Unhandled server error', err);
        res.status(400).json({ error: err });
    }
});

// Start the server
server.start(
    {
        cors: {
            credentials: true,
            origin: ['http://local.app.techjobhunt.com:3000', process.env.COMMON_FRONTEND_URL],
        },
        port: process.env.API_PORT,
    },
    // eslint-disable-next-line no-console
    () => console.log(`Server running at ${process.env.COMMON_BACKEND_URL}`)
);
