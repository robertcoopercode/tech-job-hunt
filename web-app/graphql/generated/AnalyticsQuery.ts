/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ApplicationStatus } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: AnalyticsQuery
// ====================================================

export interface AnalyticsQuery_me_addedJobs_location {
  __typename: "GoogleMapsLocation";
  name: string;
  googlePlacesId: string;
}

export interface AnalyticsQuery_me_addedJobs_company_image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
}

export interface AnalyticsQuery_me_addedJobs_company {
  __typename: "Company";
  id: string;
  image: AnalyticsQuery_me_addedJobs_company_image | null;
  name: string;
}

export interface AnalyticsQuery_me_addedJobs {
  __typename: "JobApplication";
  applicationStatus: ApplicationStatus;
  createdAt: any;
  dateApplied: any | null;
  dateDecided: any | null;
  dateInterviewing: any[];
  dateOffered: any | null;
  isRemote: boolean;
  location: AnalyticsQuery_me_addedJobs_location | null;
  company: AnalyticsQuery_me_addedJobs_company;
}

export interface AnalyticsQuery_me {
  __typename: "User";
  addedJobs: AnalyticsQuery_me_addedJobs[] | null;
}

export interface AnalyticsQuery {
  me: AnalyticsQuery_me | null;
}

export interface AnalyticsQueryVariables {
  startDate: any;
}
