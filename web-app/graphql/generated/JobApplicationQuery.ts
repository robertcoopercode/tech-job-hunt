/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ApplicationStatus, JobDecision } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: JobApplicationQuery
// ====================================================

export interface JobApplicationQuery_jobApplication_company_image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
}

export interface JobApplicationQuery_jobApplication_company {
  __typename: "Company";
  name: string;
  id: string;
  image: JobApplicationQuery_jobApplication_company_image | null;
}

export interface JobApplicationQuery_jobApplication_location {
  __typename: "GoogleMapsLocation";
  googlePlacesId: string;
  id: string;
  name: string;
}

export interface JobApplicationQuery_jobApplication_coverLetterFile {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
}

export interface JobApplicationQuery_jobApplication_contacts {
  __typename: "JobApplicationContact";
  id: string;
  name: string;
  position: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  order: number;
}

export interface JobApplicationQuery_jobApplication_resume_resume_versions {
  __typename: "AwsFileData";
  id: string;
  cloudfrontUrl: string;
  createdAt: any;
}

export interface JobApplicationQuery_jobApplication_resume_resume {
  __typename: "Resume";
  id: string;
  name: string;
  versions: JobApplicationQuery_jobApplication_resume_resume_versions[] | null;
}

export interface JobApplicationQuery_jobApplication_resume {
  __typename: "JobApplicationResume";
  id: string;
  resume: JobApplicationQuery_jobApplication_resume_resume | null;
  selectedVersionId: string;
}

export interface JobApplicationQuery_jobApplication {
  __typename: "JobApplication";
  id: string;
  company: JobApplicationQuery_jobApplication_company;
  position: string;
  location: JobApplicationQuery_jobApplication_location | null;
  rating: number | null;
  jobListingLink: string | null;
  jobListingNotes: string | null;
  coverLetterFile: JobApplicationQuery_jobApplication_coverLetterFile | null;
  contacts: JobApplicationQuery_jobApplication_contacts[] | null;
  resume: JobApplicationQuery_jobApplication_resume | null;
  isApplicationActive: boolean;
  applicationStatus: ApplicationStatus;
  createdAt: any;
  dateApplied: any | null;
  dateDecided: any | null;
  dateInterviewing: any[];
  dateOffered: any | null;
  isRemote: boolean;
  notes: string | null;
  jobDecision: JobDecision | null;
}

export interface JobApplicationQuery {
  jobApplication: JobApplicationQuery_jobApplication | null;
}

export interface JobApplicationQueryVariables {
  id: string;
}
