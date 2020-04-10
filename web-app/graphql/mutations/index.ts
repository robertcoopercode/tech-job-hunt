import gql from 'graphql-tag';

export const createJobApplicationMutation = gql`
    mutation CreateJobApplicationMutation(
        $companyId: ID!
        $position: String!
        $location: GoogleMapsLocationUpdateInput
        $isRemote: Boolean!
    ) {
        createJobApplication(companyId: $companyId, position: $position, location: $location, isRemote: $isRemote) {
            id
        }
    }
`;

export const updateJobApplicationMutation = gql`
    mutation UpdateJobApplicationMutation(
        $id: ID!
        $companyId: ID!
        $position: String!
        $location: GoogleMapsLocationUpdateInput
        $rating: Int
        $jobListingLink: String
        $jobListingNotes: String
        $isApplicationActive: Boolean
        $contacts: [JobApplicationContactCreateWithoutJobApplicationInput!]
        $resumeId: String
        $resumeVersionId: String
        $coverLetterFile: Upload
        $applicationStatus: ApplicationStatus
        $dateApplied: DateTime
        $dateDecided: DateTime
        $dateInterviewing: [DateTime!]
        $dateOffered: DateTime
        $isRemote: Boolean
        $jobDecision: JobDecision
        $isCoverLetterUpdated: Boolean!
        $notes: String
    ) {
        updateJobApplication(
            id: $id
            companyId: $companyId
            position: $position
            location: $location
            rating: $rating
            jobListingLink: $jobListingLink
            jobListingNotes: $jobListingNotes
            isApplicationActive: $isApplicationActive
            contacts: $contacts
            resumeId: $resumeId
            resumeVersionId: $resumeVersionId
            coverLetterFile: $coverLetterFile
            applicationStatus: $applicationStatus
            dateApplied: $dateApplied
            dateDecided: $dateDecided
            dateInterviewing: $dateInterviewing
            dateOffered: $dateOffered
            isRemote: $isRemote
            jobDecision: $jobDecision
            isCoverLetterUpdated: $isCoverLetterUpdated
            notes: $notes
        ) {
            id
        }
    }
`;

export const deleteResumeMutation = gql`
    mutation DeleteResumeMutation($id: ID!) {
        deleteResume(id: $id) {
            id
        }
    }
`;

export const deleteJobApplicationMutation = gql`
    mutation DeleteJobApplicationMutation($jobId: ID!) {
        deleteJobApplication(jobId: $jobId) {
            id
        }
    }
`;

export const deleteCompanyMutation = gql`
    mutation DeleteCompanyMutation($id: ID!) {
        deleteCompany(id: $id) {
            id
        }
    }
`;

export const createCompanyMutation = gql`
    mutation CreateCompanyMutation($name: String!, $image: Upload) {
        createCompany(name: $name, file: $image) {
            id
        }
    }
`;

export const updateCompanyMutation = gql`
    mutation UpdateCompanyMutation(
        $name: String!
        $website: String
        $rating: Int
        $contacts: [CompanyContactCreateWithoutCompanyInput!]
        $file: Upload
        $notes: String
        $id: ID!
        $isCompanyImageUpdated: Boolean!
    ) {
        updateCompany(
            id: $id
            name: $name
            website: $website
            rating: $rating
            contacts: $contacts
            file: $file
            notes: $notes
            isCompanyImageUpdated: $isCompanyImageUpdated
        ) {
            id
        }
    }
`;

export const upgradeUserMutation = gql`
    mutation UpgradeUserMutation(
        $paymentMethodId: String!
        $email: String!
        $planId: String!
        $card: CardUpdateWithoutBillingInfoDataInput!
    ) {
        upgradeUser(paymentMethodId: $paymentMethodId, email: $email, planId: $planId, card: $card) {
            status
            clientSecret
        }
    }
`;

export const checkSubscriptionPaymentHasSucceededMutation = gql`
    mutation CheckSubscriptionPaymentHasSucceededMutation {
        checkSubscriptionPaymentHasSucceeded
    }
`;

export const cancelSubscriptionMutation = gql`
    mutation CancelSubscriptionMutation {
        cancelSubscription {
            id
        }
    }
`;

export const updateCreditCardMutation = gql`
    mutation UpdateCreditCardMutation($card: CardUpdateInput!) {
        updateCreditCard(card: $card) {
            id
        }
    }
`;

export const createResume = gql`
    mutation CreateResumeMutation($name: String!, $file: Upload) {
        createResume(name: $name, file: $file) {
            id
            name
            Versions {
                cloudfrontUrl
                Key
            }
        }
    }
`;

export const updateResumeMutation = gql`
    mutation UpdateResumeMutation($id: ID!, $name: String!, $file: Upload) {
        updateResume(id: $id, name: $name, newFileVersion: $file) {
            id
            name
        }
    }
`;

export const deleteAccountMutation = gql`
    mutation DeleteAccountMutation {
        deleteAccount {
            id
        }
    }
`;

export const loginMutation = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            email
        }
    }
`;

export const logoutMutation = gql`
    mutation LogoutMutation {
        logout
    }
`;

export const signupMutation = gql`
    mutation SignupMutation($email: String!, $password: String!, $confirmPassword: String!) {
        signup(email: $email, password: $password, confirmPassword: $confirmPassword) {
            email
        }
    }
`;

export const requestResetPasswordMutation = gql`
    mutation RequestResetPasswordMutation($email: String!) {
        requestPasswordReset(email: $email)
    }
`;

export const resetPasswordMutation = gql`
    mutation ResetPasswordMutation($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            email
        }
    }
`;

export const verifyEmailMutation = gql`
    mutation VerifyEmailMutation($emailToken: String!) {
        verifyEmail(emailToken: $emailToken)
    }
`;

export const requestVerifyEmailMutation = gql`
    mutation RequestVerifyEmailMutation {
        requestVerifyEmail
    }
`;

export const completeOnboardingMutation = gql`
    mutation CompleteOnboardingMutation {
        completeOnboarding
    }
`;
