import { mutationField, idArg, stringArg, arg, booleanArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { freeTierJobLimit } from '../../utils/constants';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const createJobApplicationMutationField = mutationField('createJobApplication', {
    type: 'JobApplication',
    args: {
        companyId: idArg({ required: true }),
        position: stringArg({ required: true }),
        isRemote: booleanArg({ required: true }),
        location: arg({
            type: 'GoogleMapsLocationUpdateInput',
            required: false,
        }),
    },
    resolve: async (_, { companyId, position, location, isRemote }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);

        const user = await ctx.prisma.user.findOne({
            where: { id: ctx.user.id },
            select: { Billing: { select: { isPremiumActive: true } } },
        });

        const isPremium = user?.Billing?.isPremiumActive;

        if (!isPremium) {
            const jobApplications = await ctx.prisma.jobApplication.findMany({
                where: { User: { id: ctx.user.id } },
            });
            const jobApplicationsCount = jobApplications.length;

            if (jobApplicationsCount !== undefined && jobApplicationsCount > freeTierJobLimit) {
                throw Error('User cannot add new job since free tier limit has been reached.');
            }
        }

        const company = await ctx.prisma.company.findOne({
            where: { id: companyId },
            select: { name: true },
        });

        const companyName = company?.name;

        if (companyName === undefined) {
            throw Error('Company name is undefined');
        }

        const locationGooglePlacesId = location?.googlePlacesId;
        const locationName = location?.name;

        const newJobApplication = await ctx.prisma.jobApplication.create({
            data: {
                User: { connect: { id: ctx.user.id } },
                Company: { connect: { id: companyId } },
                isRemote: isRemote,
                companyName,
                position,
                locationName,
                ...(locationGooglePlacesId !== null &&
                locationGooglePlacesId !== undefined &&
                locationName !== null &&
                locationName !== undefined
                    ? {
                          Location: {
                              create: {
                                  googlePlacesId: locationGooglePlacesId,
                                  name: locationName,
                              },
                          },
                      }
                    : {}),
            },
        });

        // Set the jobApplicationsCount to the updated value on the company
        if (newJobApplication) {
            const companyJobApplications = await ctx.prisma.jobApplication.findMany({
                where: { Company: { id: companyId } },
            });
            const count = companyJobApplications.length;

            await ctx.prisma.company.update({
                where: { id: companyId },
                data: { jobApplicationsCount: count },
            });
        }

        analytics.track({
            eventType: 'Job application created',
            userId: ctx.user.id,
            eventProperties: {
                id: newJobApplication.id,
            },
        });
        return newJobApplication;
    },
});
