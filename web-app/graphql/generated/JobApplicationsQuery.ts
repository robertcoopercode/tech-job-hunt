/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { JobApplicationOrderByInput, ApplicationStatus } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: JobApplicationsQuery
// ====================================================

export interface JobApplicationsQuery_jobApplicationsConnection_edges_node_company_image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  Key: string;
}

export interface JobApplicationsQuery_jobApplicationsConnection_edges_node_company {
  __typename: "Company";
  name: string;
  image: JobApplicationsQuery_jobApplicationsConnection_edges_node_company_image | null;
}

export interface JobApplicationsQuery_jobApplicationsConnection_edges_node_location {
  __typename: "GoogleMapsLocation";
  id: string;
  googlePlacesId: string;
  name: string;
}

export interface JobApplicationsQuery_jobApplicationsConnection_edges_node {
  __typename: "JobApplication";
  id: string;
  company: JobApplicationsQuery_jobApplicationsConnection_edges_node_company;
  isRemote: boolean;
  position: string;
  createdAt: any;
  updatedAt: any;
  location: JobApplicationsQuery_jobApplicationsConnection_edges_node_location | null;
  applicationStatus: ApplicationStatus;
}

export interface JobApplicationsQuery_jobApplicationsConnection_edges {
  __typename: "JobApplicationEdge";
  node: JobApplicationsQuery_jobApplicationsConnection_edges_node;
}

export interface JobApplicationsQuery_jobApplicationsConnection {
  __typename: "JobApplicationConnection";
  edges: JobApplicationsQuery_jobApplicationsConnection_edges[];
}

export interface JobApplicationsQuery_jobsTotal_aggregate {
  __typename: "AggregateJobApplication";
  count: number;
}

export interface JobApplicationsQuery_jobsTotal {
  __typename: "JobApplicationConnection";
  aggregate: JobApplicationsQuery_jobsTotal_aggregate;
}

export interface JobApplicationsQuery {
  jobApplicationsConnection: JobApplicationsQuery_jobApplicationsConnection;
  jobsTotal: JobApplicationsQuery_jobsTotal;
}

export interface JobApplicationsQueryVariables {
  orderBy?: JobApplicationOrderByInput | null;
  first?: number | null;
  skip?: number | null;
}
