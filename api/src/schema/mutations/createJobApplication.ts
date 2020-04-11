import { mutationField, idArg, stringArg, arg, booleanArg } from '@nexus/schema';
import { catchAsyncErrors } from '../../utils/catchErrors';
import analytics from '../../utils/analytics';
import { freeTierJobLimit } from '../../utils/constants';

export const createJobApplicationMutationField = mutationField('createJobApplication', {
    type: 'JobApplication',
    args: {
        companyId: idArg(),
        position: stringArg(),
        location: arg({
            type: 'GoogleMapsLocationUpdateInput',
            required: false,
        }),
        isRemote: booleanArg(),
    },
    resolve: async (_, { companyId, position, location, isRemote }, ctx) => {
        return catchAsyncErrors(async () => {
            const {
                Billing: { isPremiumActive: isPremium },
            } = await ctx.prisma.user.findOne({
                where: { id: ctx.user.id },
                select: { Billing: { select: { isPremiumActive: true } } },
            });

            if (!isPremium) {
                const jobApplications = await ctx.prisma.jobApplication.findMany({
                    where: { User: { id: ctx.user.id } },
                });
                const jobApplicationsCount = jobApplications.length;

                if (jobApplicationsCount !== undefined && jobApplicationsCount > freeTierJobLimit) {
                    throw Error('User cannot add new job since free tier limit has been reached.');
                }
            }

            const { name: companyName } = await ctx.prisma.company.findOne({
                where: { id: companyId },
                select: { name: true },
            });

            const newJobApplication = await ctx.prisma.jobApplication.create({
                data: {
                    User: { connect: { id: ctx.user.id } },
                    Company: { connect: { id: companyId } },
                    isRemote: isRemote,
                    companyName,
                    position,
                    locationName: location && location.name,
                    ...(location
                        ? {
                              Location: {
                                  create: {
                                      googlePlacesId: location.googlePlacesId,
                                      name: location.name,
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
        });
    },
});
