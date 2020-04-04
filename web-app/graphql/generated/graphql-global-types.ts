/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  DECIDED = "DECIDED",
  INTERESTED = "INTERESTED",
  INTERVIEWING = "INTERVIEWING",
  OFFER = "OFFER",
}

export enum BillingFrequency {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum CompanyOrderByInput {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",
  id_ASC = "id_ASC",
  id_DESC = "id_DESC",
  jobApplicationsCount_ASC = "jobApplicationsCount_ASC",
  jobApplicationsCount_DESC = "jobApplicationsCount_DESC",
  name_ASC = "name_ASC",
  name_DESC = "name_DESC",
  notes_ASC = "notes_ASC",
  notes_DESC = "notes_DESC",
  rating_ASC = "rating_ASC",
  rating_DESC = "rating_DESC",
  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",
  website_ASC = "website_ASC",
  website_DESC = "website_DESC",
}

export enum JobApplicationOrderByInput {
  applicationStatus_ASC = "applicationStatus_ASC",
  applicationStatus_DESC = "applicationStatus_DESC",
  companyName_ASC = "companyName_ASC",
  companyName_DESC = "companyName_DESC",
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",
  dateApplied_ASC = "dateApplied_ASC",
  dateApplied_DESC = "dateApplied_DESC",
  dateDecided_ASC = "dateDecided_ASC",
  dateDecided_DESC = "dateDecided_DESC",
  dateOffered_ASC = "dateOffered_ASC",
  dateOffered_DESC = "dateOffered_DESC",
  id_ASC = "id_ASC",
  id_DESC = "id_DESC",
  isApplicationActive_ASC = "isApplicationActive_ASC",
  isApplicationActive_DESC = "isApplicationActive_DESC",
  isRemote_ASC = "isRemote_ASC",
  isRemote_DESC = "isRemote_DESC",
  jobDecision_ASC = "jobDecision_ASC",
  jobDecision_DESC = "jobDecision_DESC",
  jobListingLink_ASC = "jobListingLink_ASC",
  jobListingLink_DESC = "jobListingLink_DESC",
  jobListingNotes_ASC = "jobListingNotes_ASC",
  jobListingNotes_DESC = "jobListingNotes_DESC",
  locationName_ASC = "locationName_ASC",
  locationName_DESC = "locationName_DESC",
  notes_ASC = "notes_ASC",
  notes_DESC = "notes_DESC",
  position_ASC = "position_ASC",
  position_DESC = "position_DESC",
  rating_ASC = "rating_ASC",
  rating_DESC = "rating_DESC",
  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",
}

export enum JobDecision {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  REJECTED = "REJECTED",
}

export enum ResumeOrderByInput {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",
  id_ASC = "id_ASC",
  id_DESC = "id_DESC",
  name_ASC = "name_ASC",
  name_DESC = "name_DESC",
  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",
}

export interface CardUpdateWithoutBillingInfoDataInput {
  brand?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
  last4Digits?: string | null;
  stripePaymentMethodId?: string | null;
}

export interface CompanyContactCreateWithoutCompanyInput {
  email?: string | null;
  id?: string | null;
  name: string;
  notes?: string | null;
  order: number;
  phone?: string | null;
  position?: string | null;
}

export interface GoogleMapsLocationCreateInput {
  googlePlacesId: string;
  id?: string | null;
  name: string;
}

export interface JobApplicationContactCreateWithoutJobApplicationInput {
  email?: string | null;
  id?: string | null;
  name: string;
  notes?: string | null;
  order: number;
  phone?: string | null;
  position?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
