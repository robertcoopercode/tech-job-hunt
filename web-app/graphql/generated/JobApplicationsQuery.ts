/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QueryJobApplicationsOrderByInput, ApplicationStatus } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: JobApplicationsQuery
// ====================================================

export interface JobApplicationsQuery_jobApplications_nodes_Company_Image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  Key: string;
}

export interface JobApplicationsQuery_jobApplications_nodes_Company {
  __typename: "Company";
  name: string;
  Image: JobApplicationsQuery_jobApplications_nodes_Company_Image | null;
}

export interface JobApplicationsQuery_jobApplications_nodes_Location {
  __typename: "GoogleMapsLocation";
  id: string;
  googlePlacesId: string;
  name: string;
}

export interface JobApplicationsQuery_jobApplications_nodes {
  __typename: "JobApplication";
  id: string;
  Company: JobApplicationsQuery_jobApplications_nodes_Company | null;
  isRemote: boolean;
  position: string;
  createdAt: any;
  updatedAt: any;
  Location: JobApplicationsQuery_jobApplications_nodes_Location | null;
  applicationStatus: ApplicationStatus;
}

export interface JobApplicationsQuery_jobApplications {
  __typename: "QueryJobApplications_Connection";
  /**
   * Flattened list of JobApplication type
   */
  nodes: JobApplicationsQuery_jobApplications_nodes[];
  totalCount: number;
}

export interface JobApplicationsQuery {
  jobApplications: JobApplicationsQuery_jobApplications;
}

export interface JobApplicationsQueryVariables {
  orderBy?: QueryJobApplicationsOrderByInput | null;
  first?: number | null;
  skip?: number | null;
}
