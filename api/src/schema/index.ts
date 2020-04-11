if (require.main === module) {
    // Only import the environment variables if executing this file directly: https://stackoverflow.com/a/6090287/8360496
    // The schema file gets executed directly when running the generate command: yarn generate
    // Without this check, we would be trying to load the environment variables twice and that causes warnings to be thrown in the console
    require('dotenv-flow').config();
}
import path from 'path';
import { makeSchema, connectionPlugin, intArg } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
import { PrismaClient, User as PrismaClientUser } from '@prisma/client';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { Response as ExpressResponse } from 'express-serve-static-core';
import { Query } from './queries';
import { Mutation } from './mutations';
import {
    JobApplication,
    Company,
    Resume,
    BillingInfo,
    User,
    StripeSubscription,
    Card,
    AwsFileData,
    GoogleMapsLocation,
    JobApplicationResume,
    CompanyContact,
    JobApplicationContact,
    JobApplication_dateInterviewing,
} from './objectTypes';
import { signupMutationField } from './mutations/signup';
import { loginMutationField } from './mutations/login';
import { logoutMutationField } from './mutations/logout';
import { completeOnboardingMutationField } from './mutations/completeOnboarding';
import { requestPasswordResetMutationField } from './mutations/requestPasswordReset';
import { resetPasswordMutationField } from './mutations/resetPassword';
import { checkSubscriptionPaymentHasSucceededMutationField } from './mutations/checkSubscriptionPaymentHasSucceeded';
import { cancelSubscriptionMutationField } from './mutations/cancelSubscription';
import { deleteAccountMutationField } from './mutations/deleteAccount';
import { deleteCompanyMutationField } from './mutations/deleteCompany';
import { deleteJobApplicationMutationField } from './mutations/deleteJobApplication';
import { deleteResumeMutationField } from './mutations/deleteResume';
import { JobApplicationOrderByInput } from './inputTypes';
import { OrderByArg } from './enumTypes';
import { upgradeUserMutationField } from './mutations/upgradeUser';
import { updateCreditCardMutationField } from './mutations/updateCreditCard';
import { verifyEmailMutationField } from './mutations/verifyEmail';
import { requestVerifyEmailMutationField } from './mutations/requestVerifyEmail';
import { createCompanyMutationField } from './mutations/createCompany';
import { createResumeMutationField } from './mutations/createResume';
import { updateCompanyMutationField } from './mutations/updateCompany';
import { createJobApplicationMutationField } from './mutations/createJobApplication';
import { updateJobApplicationMutationField } from './mutations/updateJobApplication';
import { Upload } from './scarlarTypes';
import { updateResumeMutationField } from './mutations/updateResume';

const prisma = new PrismaClient();

export type Context = {
    prisma: PrismaClient;
    user: PrismaClientUser | null;
    response: ExpressResponse;
};

export const createContext = async ({ request, response }: ContextParameters): Promise<Context> => {
    let user: PrismaClientUser = null;
    // If user isn't logged in, keep user as null
    if (request.userId) {
        user = await prisma.user.findOne({ where: { id: request.userId } });
    }
    request.prismaClientUser = user;

    return {
        user,
        prisma,
        response: response,
    };
};

// https://github.com/graphql-nexus/nexus-schema-plugin-prisma/blob/master/examples/blog/src/schema/index.ts
export const schema = makeSchema({
    shouldGenerateArtifacts: true,
    types: [
        // Object Types
        AwsFileData,
        BillingInfo,
        Card,
        Company,
        CompanyContact,
        GoogleMapsLocation,
        JobApplication_dateInterviewing,
        JobApplication,
        JobApplicationContact,
        JobApplicationResume,
        Resume,
        StripeSubscription,
        Upload,
        User,

        // Input Types
        JobApplicationOrderByInput,

        // Enum Types
        OrderByArg,

        // Queries
        Query,

        // Mutations
        Mutation,
        cancelSubscriptionMutationField,
        checkSubscriptionPaymentHasSucceededMutationField,
        completeOnboardingMutationField,
        createCompanyMutationField,
        createJobApplicationMutationField,
        createResumeMutationField,
        deleteAccountMutationField,
        deleteCompanyMutationField,
        deleteJobApplicationMutationField,
        deleteResumeMutationField,
        loginMutationField,
        logoutMutationField,
        requestPasswordResetMutationField,
        requestVerifyEmailMutationField,
        resetPasswordMutationField,
        signupMutationField,
        updateCompanyMutationField,
        updateCreditCardMutationField,
        updateJobApplicationMutationField,
        updateResumeMutationField,
        upgradeUserMutationField,
        verifyEmailMutationField,
    ],
    plugins: [
        nexusPrismaPlugin(),
        connectionPlugin({
            includeNodesField: true,
            disableBackwardPagination: true,
            additionalArgs: {
                skip: intArg(),
            },
        }),
    ],
    typegenAutoConfig: {
        contextType: 'Context.Context',
        sources: [
            {
                source: '@prisma/client',
                alias: 'prisma',
            },
            {
                source: require.resolve('.'),
                alias: 'Context',
            },
        ],
    },
    outputs: {
        schema: path.join(__dirname, '../generated/schema.graphql'),
        typegen: path.join(__dirname, '../generated/nexus.ts'),
    },
});
