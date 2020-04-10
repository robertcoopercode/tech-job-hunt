import { objectType } from '@nexus/schema';

export const Resume = objectType({
    name: 'Resume',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.name();
        t.model.updatedAt();
        t.model.User();
        t.model.JobApplicationResume();
        t.model.Versions({ ordering: { createdAt: true } });
    },
});

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.model.email();
        t.model.hasCompletedOnboarding();
        t.model.Billing();
        t.model.Company();
        t.model.JobApplication();
        t.model.Resume();
        t.model.hasVerifiedEmail();
    },
});

export const Company = objectType({
    name: 'Company',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.Image();
        t.model.jobApplicationsCount();
        t.model.name();
        t.model.notes();
        t.model.rating();
        t.model.updatedAt();
        t.model.website();
        t.model.User();
        t.model.Contacts({ ordering: { order: true } });
        t.model.JobApplication();
    },
});

export const JobApplication = objectType({
    name: 'JobApplication',
    definition(t) {
        t.model.id();
        t.model.applicationStatus();
        t.model.companyName();
        t.model.CoverLetterFile();
        t.model.createdAt();
        t.model.dateApplied();
        t.model.dateDecided();
        t.model.dateOffered();
        t.model.isApplicationActive();
        t.model.isRemote();
        t.model.jobDecision();
        t.model.jobListingLink();
        t.model.jobListingNotes();
        t.model.Location();
        t.model.locationName();
        t.model.notes();
        t.model.position();
        t.model.rating();
        t.model.Resume();
        t.model.updatedAt();
        t.model.Company();
        t.model.User();
        t.model.Contacts({ ordering: { order: true } });
        t.model.JobApplication_dateInterviewing();
    },
});

export const AwsFileData = objectType({
    name: 'AwsFileData',
    definition(t) {
        t.model.Company();
        t.model.ETag();
        t.model.JobApplication();
        t.model.Key();
        t.model.Location();
        t.model.Resume();
        t.model.VersionId();
        t.model.cloudfrontUrl();
        t.model.createdAt();
        t.model.fileName();
        t.model.id();
        t.model.s3Url();
    },
});

export const JobApplicationResume = objectType({
    name: 'JobApplicationResume',
    definition(t) {
        t.model.JobApplication();
        t.model.Resume();
        t.model.id();
        t.model.selectedVersionId();
    },
});

export const GoogleMapsLocation = objectType({
    name: 'GoogleMapsLocation',
    definition(t) {
        t.model.JobApplication();
        t.model.id();
        t.model.name();
        t.model.googlePlacesId();
    },
});

export const JobApplicationContact = objectType({
    name: 'JobApplicationContact',
    definition(t) {
        t.model.JobApplication();
        t.model.email();
        t.model.id();
        t.model.name();
        t.model.notes();
        t.model.order();
        t.model.phone();
        t.model.position();
    },
});

export const JobApplication_dateInterviewing = objectType({
    name: 'JobApplication_dateInterviewing',
    definition(t) {
        t.model.nodeId();
        t.model.JobApplication();
        t.model.position();
        t.model.value();
    },
});

export const CompanyContact = objectType({
    name: 'CompanyContact',
    definition(t) {
        t.model.Company();
        t.model.email();
        t.model.id();
        t.model.name();
        t.model.notes();
        t.model.order();
        t.model.phone();
        t.model.position();
    },
});

export const BillingInfo = objectType({
    name: 'BillingInfo',
    definition(t) {
        t.model.billingFrequency();
        t.model.Card();
        t.model.endOfBillingPeriod();
        t.model.id();
        t.model.isPremiumActive();
        t.model.startOfBillingPeriod();
        t.model.stripeCustomerId();
        t.model.stripeSubscriptionId();
        t.model.willCancelAtEndOfPeriod();
        t.model.Card();
        t.model.User();
    },
});

export const Card = objectType({
    name: 'Card',
    definition(t) {
        t.model.id();
        t.model.brand();
        t.model.expMonth();
        t.model.expYear();
        t.model.last4Digits();
        t.model.stripePaymentMethodId();
    },
});

export const StripeSubscription = objectType({
    name: 'StripeSubscription',
    definition(t) {
        t.string('status');
        t.string('clientSecret');
    },
});
