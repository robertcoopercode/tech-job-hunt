/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GoogleMapsLocationUpdateInput, JobApplicationContactCreateWithoutJobApplicationInput, ApplicationStatus, JobDecision } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateJobApplicationMutation
// ====================================================

export interface UpdateJobApplicationMutation_updateJobApplication {
  __typename: "JobApplication";
  id: string;
}

export interface UpdateJobApplicationMutation {
  updateJobApplication: UpdateJobApplicationMutation_updateJobApplication;
}

export interface UpdateJobApplicationMutationVariables {
  id: string;
  companyId: string;
  position: string;
  location?: GoogleMapsLocationUpdateInput | null;
  rating?: number | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  isApplicationActive?: boolean | null;
  contacts: JobApplicationContactCreateWithoutJobApplicationInput[];
  resumeId?: string | null;
  resumeVersionId?: string | null;
  coverLetterFile?: any | null;
  applicationStatus?: ApplicationStatus | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateInterviewing?: any[] | null;
  dateOffered?: any | null;
  isRemote?: boolean | null;
  jobDecision?: JobDecision | null;
  isCoverLetterUpdated: boolean;
  notes?: string | null;
}
