import { prismaObjectType } from 'nexus-prisma';
import { idArg } from 'nexus';
import { GraphQLServerContext } from '.';

export const Query = prismaObjectType<'Query'>({
    name: 'Query',
    definition(t) {
        t.field('me', {
            type: 'User',
            nullable: true,
            resolve: async (_root, _args, ctx: GraphQLServerContext) => {
                if (!ctx.request.userId) {
                    return null;
                }
                const user = await ctx.prisma.user({ id: ctx.request.userId });
                return user;
            },
        });
        t.field('jobApplication', {
            type: 'JobApplication',
            args: {
                id: idArg({ required: true }),
            },
            ...t.prismaType.jobApplication,
            resolve: async (_root, args, ctx: GraphQLServerContext) => {
                const jobApplicationUser = await ctx.prisma.jobApplication({ id: args.where.id }).user();

                if (!jobApplicationUser && jobApplicationUser.id !== ctx.request.userId) {
                    throw Error('Job application does not belong to user');
                }

                return ctx.prisma.jobApplication({ id: args.where.id });
            },
        });
        t.field('company', {
            type: 'Company',
            args: {
                id: idArg({ required: true }),
            },
            ...t.prismaType.company,
            resolve: async (_root, args, ctx: GraphQLServerContext) => {
                const companyUser = await ctx.prisma.company({ id: args.where.id }).user();

                if (!companyUser && companyUser.id !== ctx.request.userId) {
                    throw Error('Company does not belong to user');
                }

                return ctx.prisma.company({ id: args.where.id });
            },
        });
        t.field('resume', {
            type: 'Resume',
            args: {
                id: idArg({ required: true }),
            },
            ...t.prismaType.resume,
            resolve: async (_root, args, ctx: GraphQLServerContext) => {
                const resumeUser = await ctx.prisma.resume({ id: args.where.id }).user();

                if (!resumeUser && resumeUser.id !== ctx.request.userId) {
                    throw Error('Resume does not belong to user');
                }

                return ctx.prisma.resume({ id: args.where.id });
            },
        });
        t.field('jobApplicationsConnection', {
            ...t.prismaType.jobApplicationsConnection,
            args: {
                first: t.prismaType.jobApplicationsConnection.args.first,
                skip: t.prismaType.jobApplicationsConnection.args.skip,
                orderBy: t.prismaType.jobApplicationsConnection.args.orderBy,
            },
            resolve: async (_root, args, ctx: GraphQLServerContext) => {
                const aggregate = await ctx.prisma
                    .jobApplicationsConnection({
                        ...args,
                        where: { user: { id: ctx.request.userId } },
                    })
                    .aggregate();

                const connection = await ctx.prisma.jobApplicationsConnection({
                    ...args,
                    where: { user: { id: ctx.request.userId } },
                });

                return {
                    ...connection,
                    aggregate: {
                        ...aggregate,
                    },
                };
            },
        });
        t.field('companiesConnection', {
            ...t.prismaType.companiesConnection,
            args: {
                first: t.prismaType.companiesConnection.args.first,
                skip: t.prismaType.companiesConnection.args.skip,
                orderBy: t.prismaType.companiesConnection.args.orderBy,
            },
            resolve: async (_root, args, ctx: GraphQLServerContext) => {
                const aggregate = await ctx.prisma
                    .companiesConnection({
                        ...args,
                        where: { user: { id: ctx.request.userId } },
                    })
                    .aggregate();

                const connection = await ctx.prisma.companiesConnection({
                    ...args,
                    where: { user: { id: ctx.request.userId } },
                });

                return {
                    ...connection,
                    aggregate: {
                        ...aggregate,
                    },
                };
            },
        });
        t.field('resumesConnection', {
            ...t.prismaType.resumesConnection,
            args: {
                first: t.prismaType.resumesConnection.args.first,
                skip: t.prismaType.resumesConnection.args.skip,
                orderBy: t.prismaType.resumesConnection.args.orderBy,
            },
            resolve: async (_root, args, ctx: GraphQLServerContext) => {
                const aggregate = await ctx.prisma
                    .resumesConnection({
                        ...args,
                        where: { user: { id: ctx.request.userId } },
                    })
                    .aggregate();

                const connection = await ctx.prisma.resumesConnection({
                    ...args,
                    where: { user: { id: ctx.request.userId } },
                });

                return {
                    ...connection,
                    aggregate: {
                        ...aggregate,
                    },
                };
            },
        });
    },
});

export const JobApplicationConnection = prismaObjectType({
    name: 'JobApplicationConnection',
    definition(t) {
        t.prismaFields({ filter: ['aggregate'] });

        t.field('aggregate', {
            type: 'AggregateJobApplication',
            resolve(root) {
                return {
                    ...(root as any).aggregate,
                };
            },
        });
    },
});

export const CompanyConnection = prismaObjectType({
    name: 'CompanyConnection',
    definition(t) {
        t.prismaFields({ filter: ['aggregate'] });

        t.field('aggregate', {
            type: 'AggregateCompany',
            resolve(root) {
                return {
                    ...(root as any).aggregate,
                };
            },
        });
    },
});

export const ResumeConnection = prismaObjectType({
    name: 'ResumeConnection',
    definition(t) {
        t.prismaFields({ filter: ['aggregate'] });

        t.field('aggregate', {
            type: 'AggregateResume',
            resolve(root) {
                return {
                    ...(root as any).aggregate,
                };
            },
        });
    },
});
