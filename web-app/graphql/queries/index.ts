import gql from 'graphql-tag';

export const currentUserQuery = gql`
    query CurrentUserQuery {
        me {
            id
            billing {
                billingFrequency
                isPremiumActive
                startOfBillingPeriod
                endOfBillingPeriod
                willCancelAtEndOfPeriod
                stripeCustomerId
                card {
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
        me {
            id
            companies(where: { name_contains: $searchQuery }, first: 4, orderBy: updatedAt_DESC) {
                id
                name
                image {
                    cloudfrontUrl
                }
            }
        }
    }
`;

export const suggestedResumesQuery = gql`
    query SuggestedResumesQuery($searchQuery: String!) {
        me {
            id
            resumes(where: { name_contains: $searchQuery }, first: 4, orderBy: updatedAt_DESC) {
                id
                name
                versions {
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
    query ResumesQuery($orderBy: ResumeOrderByInput, $first: Int, $skip: Int) {
        resumesConnection(orderBy: $orderBy, first: $first, skip: $skip) {
            edges {
                node {
                    id
                    name
                    updatedAt
                    versions {
                        cloudfrontUrl
                        VersionId
                        createdAt
                    }
                    versions {
                        cloudfrontUrl
                        fileName
                        VersionId
                        createdAt
                    }
                }
            }
        }
        resumesTotal: resumesConnection {
            aggregate {
                count
            }
        }
    }
`;

export const resumeQuery = gql`
    query ResumeQuery($id: ID!) {
        resume(where: { id: $id }) {
            id
            name
            updatedAt
            versions(orderBy: createdAt_DESC) {
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
        jobApplicationsConnection {
            aggregate {
                count
            }
        }
    }
`;

export const jobApplicationsQuery = gql`
    query JobApplicationsQuery(
        $orderBy: JobApplicationOrderByInput = updatedAt_DESC
        $first: Int = 10
        $skip: Int = 0
    ) {
        jobApplicationsConnection(orderBy: $orderBy, first: $first, skip: $skip) {
            edges {
                node {
                    id
                    company {
                        name
                        image {
                            cloudfrontUrl
                            Key
                        }
                    }
                    isRemote
                    position
                    createdAt
                    updatedAt
                    location {
                        id
                        googlePlacesId
                        name
                    }
                    applicationStatus
                }
            }
        }
        jobsTotal: jobApplicationsConnection {
            aggregate {
                count
            }
        }
    }
`;

export const companiesQuery = gql`
    query CompaniesQuery($orderBy: CompanyOrderByInput, $first: Int, $skip: Int) {
        companiesConnection(orderBy: $orderBy, first: $first, skip: $skip) {
            edges {
                node {
                    id
                    name
                    rating
                    image {
                        cloudfrontUrl
                        Key
                    }
                    jobApplicationsCount
                    updatedAt
                }
            }
        }
        companiesTotal: companiesConnection {
            aggregate {
                count
            }
        }
    }
`;

export const jobApplicationQuery = gql`
    query JobApplicationQuery($id: ID!) {
        jobApplication(where: { id: $id }) {
            id
            company {
                name
                id
                image {
                    cloudfrontUrl
                    fileName
                }
            }
            position
            location {
                googlePlacesId
                id
                name
            }
            rating
            jobListingLink
            jobListingNotes
            coverLetterFile {
                cloudfrontUrl
                fileName
            }
            contacts(orderBy: order_ASC) {
                id
                name
                position
                email
                phone
                notes
                order
            }
            resume {
                id
                resume {
                    id
                    name
                    versions {
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
            dateInterviewing
            dateOffered
            isRemote
            notes
            jobDecision
        }
    }
`;

export const companyQuery = gql`
    query CompanyQuery($id: ID!) {
        company(where: { id: $id }) {
            id
            name
            contacts(orderBy: order_ASC) {
                email
                id
                name
                position
                notes
                phone
                order
            }
            rating
            image {
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
        me {
            addedJobs: jobApplications(where: { AND: { createdAt_gte: $startDate } }) {
                applicationStatus
                createdAt
                dateApplied
                dateDecided
                dateInterviewing
                dateOffered
                isRemote
                location {
                    name
                    googlePlacesId
                }
                company {
                    id
                    image {
                        cloudfrontUrl
                    }
                    name
                }
            }
        }
    }
`;
