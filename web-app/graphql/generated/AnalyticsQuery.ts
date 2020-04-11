/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ApplicationStatus } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: AnalyticsQuery
// ====================================================

export interface AnalyticsQuery_addedJobs_nodes_JobApplication_dateInterviewing {
  __typename: "JobApplication_dateInterviewing";
  value: any;
}

export interface AnalyticsQuery_addedJobs_nodes_Location {
  __typename: "GoogleMapsLocation";
  name: string;
  googlePlacesId: string;
}

export interface AnalyticsQuery_addedJobs_nodes_Company_Image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
}

export interface AnalyticsQuery_addedJobs_nodes_Company {
  __typename: "Company";
  id: string;
  Image: AnalyticsQuery_addedJobs_nodes_Company_Image | null;
  name: string;
}

export interface AnalyticsQuery_addedJobs_nodes {
  __typename: "JobApplication";
  applicationStatus: ApplicationStatus;
  createdAt: any;
  dateApplied: any | null;
  dateDecided: any | null;
  JobApplication_dateInterviewing: AnalyticsQuery_addedJobs_nodes_JobApplication_dateInterviewing[];
  dateOffered: any | null;
  isRemote: boolean;
  Location: AnalyticsQuery_addedJobs_nodes_Location | null;
  Company: AnalyticsQuery_addedJobs_nodes_Company | null;
}

export interface AnalyticsQuery_addedJobs {
  __typename: "QueryJobApplications_Connection";
  /**
   * Flattened list of JobApplication type
   */
  nodes: AnalyticsQuery_addedJobs_nodes[];
}

export interface AnalyticsQuery {
  addedJobs: AnalyticsQuery_addedJobs;
}

export interface AnalyticsQueryVariables {
  startDate: any;
}
