import { ApplicationStatus } from '../graphql/generated/graphql-global-types';

/**
 * Title case the application status text
 * @param applicationStatus
 */
export const formatApplicationStatusText = (applicationStatus: ApplicationStatus): string => {
    return applicationStatus[0] + applicationStatus.substring(1).toLowerCase();
};
