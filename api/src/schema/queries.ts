import { queryType, idArg, arg, stringArg } from '@nexus/schema';
import { verifyUserIsAuthenticated } from '../utils/verifyUserIsAuthenticated';

export const Query = queryType({
    definition(t) {
        // The following aliased queries are only used in order to generate types. Their alias lines up with another query name in order
        // to define our own resolvers: https://github.com/graphql-nexus/nexus-schema-plugin-prisma/issues/381#issuecomment-575357444
        t.crud.jobApplications({
            alias: 'jobApplications',
            ordering: {
                position: true,
                companyName: true,
                updatedAt: true,
                locationName: true,
                applicationStatus: true,
            },
        });
        t.crud.companies({
            alias: 'companies',
            ordering: { updatedAt: true, name: true, jobApplicationsCount: true },
        });
        t.crud.resumes({ alias: 'resumes', ordering: { updatedAt: true, name: true } });

        t.field('me', {
            type: 'User',
            nullable: true,
            resolve: async (_root, _args, ctx) => {
                if (ctx.user === null) {
                    return null;
                }
                return ctx.user;
            },
        });
        t.field('jobApplication', {
            type: 'JobApplication',
            args: {
                id: idArg({ required: true }),
            },
            resolve: async (_root, args, ctx) => {
                verifyUserIsAuthenticated(ctx.user);
                const jobApplication = await ctx.prisma.jobApplication.findOne({ where: { id: args.id } });
                const jobApplicationUserId = jobApplication?.user;
                if (jobApplication === null) {
                    throw Error('Job application does not exist');
                }
                if (jobApplicationUserId !== ctx.user.id) {
                    throw Error('Job application does not belong to user');
                }

                return jobApplication;
            },
        });
        t.field('company', {
            type: 'Company',
            args: {
                id: idArg({ required: true }),
            },
            resolve: async (_root, args, ctx) => {
                verifyUserIsAuthenticated(ctx.user);
                const company = await ctx.prisma.company.findOne({ where: { id: args.id } });
                const companyUserId = company?.user;

                if (company === null) {
                    throw Error('Company does not exist');
                }
                if (companyUserId !== ctx.user.id) {
                    throw Error('Company does not belong to user');
                }

                return company;
            },
        });
        t.field('resume', {
            type: 'Resume',
            args: {
                id: idArg({ required: true }),
            },
            resolve: async (_root, args, ctx) => {
                verifyUserIsAuthenticated(ctx.user);
                const resume = await ctx.prisma.resume.findOne({ where: { id: args.id } });

                if (resume === null) {
                    throw Error('Resume does not exist');
                }
                const resumeUserId = resume.user;

                if (resumeUserId !== ctx.user.id) {
                    throw Error('Resume does not belong to user');
                }

                return resume;
            },
        });
        t.connectionField('jobApplications', {
            type: 'JobApplication',
            additionalArgs: {
                orderBy: arg({
                    type: 'QueryJobApplicationsOrderByInput',
                }),
                where: arg({
                    type: 'JobApplicationWhereInput',
                }),
            },
            inheritAdditionalArgs: true,
            nodes(root, args, ctx, _info) {
                verifyUserIsAuthenticated(ctx.user);
                const { skip, orderBy, first, where } = args;
                return ctx.prisma.jobApplication.findMany({
                    where: { ...where, user: ctx.user.id },
                    skip,
                    orderBy,
                    first,
                });
            },
            extendConnection(t) {
                t.int('totalCount', {
                    resolve: async (root, args, ctx) => {
                        verifyUserIsAuthenticated(ctx.user);
                        const jobApplications = await ctx.prisma.jobApplication.findMany({
                            where: { user: ctx.user.id },
                        });
                        return jobApplications.length;
                    },
                });
            },
        });
        t.connectionField('companies', {
            type: 'Company',
            additionalArgs: {
                nameQuery: stringArg(),
                orderBy: arg({
                    type: 'QueryCompaniesOrderByInput',
                }),
                where: arg({
                    type: 'CompanyWhereInput',
                }),
            },
            inheritAdditionalArgs: true,
            nodes(root, args, ctx, _info) {
                const { skip, orderBy, first, where } = args;
                verifyUserIsAuthenticated(ctx.user);
                return ctx.prisma.company.findMany({
                    where: { ...where, user: ctx.user.id, name: { contains: args.nameQuery } },
                    skip,
                    orderBy,
                    first,
                });
            },
            extendConnection(t) {
                t.int('totalCount', {
                    resolve: async (root, args, ctx) => {
                        verifyUserIsAuthenticated(ctx.user);
                        const companies = await ctx.prisma.company.findMany({
                            where: { user: ctx.user.id },
                        });
                        return companies.length;
                    },
                });
            },
        });

        t.connectionField('resumes', {
            type: 'Resume',
            additionalArgs: {
                nameQuery: stringArg(),
                orderBy: arg({
                    type: 'QueryResumesOrderByInput',
                }),
                where: arg({
                    type: 'ResumeWhereInput',
                }),
            },
            inheritAdditionalArgs: true,
            nodes(root, args, ctx, _info) {
                verifyUserIsAuthenticated(ctx.user);
                const { skip, orderBy, first, where } = args;
                return ctx.prisma.resume.findMany({
                    where: { ...where, user: ctx.user.id, name: { contains: args.nameQuery } },
                    skip,
                    orderBy,
                    first,
                });
            },
            extendConnection(t) {
                t.int('totalCount', {
                    resolve: async (root, args, ctx) => {
                        verifyUserIsAuthenticated(ctx.user);
                        const resumes = await ctx.prisma.resume.findMany({
                            where: { user: ctx.user.id },
                        });
                        return resumes.length;
                    },
                });
            },
        });
    },
});
