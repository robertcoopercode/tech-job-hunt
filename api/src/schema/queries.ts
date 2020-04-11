import { queryType, idArg, arg, stringArg } from '@nexus/schema';

export const Query = queryType({
    definition(t) {
        // The following aliased queries are only used in order to generate and use types for the custom connection queries below
        // The queries will not be accessible since they are explicitly blocked by graphql-shield in the index.ts file
        t.crud.jobApplications({
            alias: '_jobApplications',
            ordering: {
                position: true,
                companyName: true,
                updatedAt: true,
                locationName: true,
                applicationStatus: true,
            },
        });
        t.crud.companies({
            alias: '_companies',
            ordering: { updatedAt: true, name: true, jobApplicationsCount: true },
        });
        t.crud.resumes({ alias: '_resumes', ordering: { updatedAt: true, name: true } });

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
                const jobApplication = await ctx.prisma.jobApplication.findOne({ where: { id: args.id } });
                const jobApplicationUserId = await jobApplication.user;
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
                const company = await ctx.prisma.company.findOne({ where: { id: args.id } });
                const companyUserId = company.user;

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
                const resume = await ctx.prisma.resume.findOne({ where: { id: args.id } });
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
