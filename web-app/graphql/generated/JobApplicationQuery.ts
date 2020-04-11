/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ApplicationStatus, JobDecision } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: JobApplicationQuery
// ====================================================

export interface JobApplicationQuery_jobApplication_Company_Image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
}

export interface JobApplicationQuery_jobApplication_Company {
  __typename: "Company";
  name: string;
  id: string;
  Image: JobApplicationQuery_jobApplication_Company_Image | null;
}

export interface JobApplicationQuery_jobApplication_Location {
  __typename: "GoogleMapsLocation";
  googlePlacesId: string;
  id: string;
  name: string;
}

export interface JobApplicationQuery_jobApplication_CoverLetterFile {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
}

export interface JobApplicationQuery_jobApplication_Contacts {
  __typename: "JobApplicationContact";
  id: string;
  name: string;
  position: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  order: number;
}

export interface JobApplicationQuery_jobApplication_Resume_Resume_Versions {
  __typename: "AwsFileData";
  id: string;
  cloudfrontUrl: string;
  createdAt: any;
}

export interface JobApplicationQuery_jobApplication_Resume_Resume {
  __typename: "Resume";
  id: string;
  name: string;
  Versions: JobApplicationQuery_jobApplication_Resume_Resume_Versions[];
}

export interface JobApplicationQuery_jobApplication_Resume {
  __typename: "JobApplicationResume";
  id: string;
  Resume: JobApplicationQuery_jobApplication_Resume_Resume | null;
  selectedVersionId: string;
}

export interface JobApplicationQuery_jobApplication_JobApplication_dateInterviewing {
  __typename: "JobApplication_dateInterviewing";
  value: any;
}

export interface JobApplicationQuery_jobApplication {
  __typename: "JobApplication";
  id: string;
  Company: JobApplicationQuery_jobApplication_Company | null;
  position: string;
  Location: JobApplicationQuery_jobApplication_Location | null;
  rating: number | null;
  jobListingLink: string | null;
  jobListingNotes: string | null;
  CoverLetterFile: JobApplicationQuery_jobApplication_CoverLetterFile | null;
  Contacts: JobApplicationQuery_jobApplication_Contacts[];
  Resume: JobApplicationQuery_jobApplication_Resume | null;
  isApplicationActive: boolean;
  applicationStatus: ApplicationStatus;
  createdAt: any;
  dateApplied: any | null;
  dateDecided: any | null;
  JobApplication_dateInterviewing: JobApplicationQuery_jobApplication_JobApplication_dateInterviewing[];
  dateOffered: any | null;
  isRemote: boolean;
  notes: string | null;
  jobDecision: JobDecision | null;
}

export interface JobApplicationQuery {
  jobApplication: JobApplicationQuery_jobApplication;
}

export interface JobApplicationQueryVariables {
  id: string;
}
