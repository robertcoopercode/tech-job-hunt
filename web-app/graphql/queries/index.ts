import gql from 'graphql-tag';

export const currentUserQuery = gql`
    query CurrentUserQuery {
        me {
            id
            Billing {
                billingFrequency
                isPremiumActive
                startOfBillingPeriod
                endOfBillingPeriod
                willCancelAtEndOfPeriod
                stripeCustomerId
                Card {
                    brand
                    last4Digits
                    expMonth
                    expYear
                }
            }
            email
            hasVerifiedEmail
            hasCompletedOnboarding
        }
    }
`;

export const suggestedCompaniesQuery = gql`
    query SuggestedCompanies($searchQuery: String!) {
        companies(first: 4, nameQuery: $searchQuery) {
            nodes {
                id
                name
                Image {
                    cloudfrontUrl
                }
            }
        }
    }
`;

export const suggestedResumesQuery = gql`
    query SuggestedResumesQuery($searchQuery: String!) {
        resumes(nameQuery: $searchQuery, first: 4) {
            nodes {
                id
                name
                Versions {
                    id
                    cloudfrontUrl
                    VersionId
                    createdAt
                }
            }
        }
    }
`;

export const resumesQuery = gql`
    query ResumesQuery($first: Int = 10000, $skip: Int, $orderBy: QueryResumesOrderByInput) {
        resumes(first: $first, skip: $skip, orderBy: $orderBy) {
            nodes {
                id
                name
                updatedAt
                Versions {
                    cloudfrontUrl
                    fileName
                    VersionId
                    createdAt
                }
            }
            totalCount
        }
    }
`;

export const resumeQuery = gql`
    query ResumeQuery($id: ID!) {
        resume(id: $id) {
            id
            name
            updatedAt
            Versions(orderBy: { createdAt: desc }) {
                fileName
                cloudfrontUrl
                VersionId
                createdAt
            }
        }
    }
`;

export const jobApplicationsCountQuery = gql`
    query JobApplicationsCountQuery {
        jobApplications(first: 1) {
            totalCount
        }
    }
`;

export const jobApplicationsQuery = gql`
    query JobApplicationsQuery(
        $orderBy: QueryJobApplicationsOrderByInput = { updatedAt: desc }
        $first: Int = 10000
        $skip: Int
    ) {
        jobApplications(first: $first, skip: $skip, orderBy: $orderBy) {
            nodes {
                id
                Company {
                    name
                    Image {
                        cloudfrontUrl
                        Key
                    }
                }
                isRemote
                position
                createdAt
                updatedAt
                Location {
                    id
                    googlePlacesId
                    name
                }
                applicationStatus
            }
            totalCount
        }
    }
`;

export const companiesQuery = gql`
    query CompaniesQuery($orderBy: QueryCompaniesOrderByInput, $first: Int = 10000, $skip: Int) {
        companies(orderBy: $orderBy, first: $first, skip: $skip) {
            nodes {
                id
                name
                rating
                Image {
                    cloudfrontUrl
                    Key
                }
                jobApplicationsCount
                updatedAt
            }
            totalCount
        }
    }
`;

export const jobApplicationQuery = gql`
    query JobApplicationQuery($id: ID!) {
        jobApplication(id: $id) {
            id
            Company {
                name
                id
                Image {
                    cloudfrontUrl
                    fileName
                }
            }
            position
            Location {
                googlePlacesId
                id
                name
            }
            rating
            jobListingLink
            jobListingNotes
            CoverLetterFile {
                cloudfrontUrl
                fileName
            }
            Contacts(orderBy: { order: asc }) {
                id
                name
                position
                email
                phone
                notes
                order
            }
            Resume {
                id
                Resume {
                    id
                    name
                    Versions {
                        id
                        cloudfrontUrl
                        createdAt
                    }
                }
                selectedVersionId
            }
            isApplicationActive
            applicationStatus
            createdAt
            dateApplied
            dateDecided
            JobApplication_dateInterviewing {
                value
            }
            dateOffered
            isRemote
            notes
            jobDecision
        }
    }
`;

export const companyQuery = gql`
    query CompanyQuery($id: ID!) {
        company(id: $id) {
            id
            name
            Contacts(orderBy: { order: asc }) {
                email
                id
                name
                position
                notes
                phone
                order
            }
            rating
            Image {
                cloudfrontUrl
                fileName
                Key
            }
            website
            notes
            jobApplicationsCount
        }
    }
`;

export const analyticsQuery = gql`
    query AnalyticsQuery($startDate: DateTime!) {
        addedJobs: jobApplications(first: 10000, where: { AND: { createdAt: { gte: $startDate } } }) {
            nodes {
                applicationStatus
                createdAt
                dateApplied
                dateDecided
                JobApplication_dateInterviewing {
                    value
                }
                dateOffered
                isRemote
                Location {
                    name
                    googlePlacesId
                }
                Company {
                    id
                    Image {
                        cloudfrontUrl
                    }
                    name
                }
            }
        }
    }
`;
