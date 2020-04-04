/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: JobApplicationsCountQuery
// ====================================================

export interface JobApplicationsCountQuery_jobApplicationsConnection_aggregate {
  __typename: "AggregateJobApplication";
  count: number;
}

export interface JobApplicationsCountQuery_jobApplicationsConnection {
  __typename: "JobApplicationConnection";
  aggregate: JobApplicationsCountQuery_jobApplicationsConnection_aggregate;
}

export interface JobApplicationsCountQuery {
  jobApplicationsConnection: JobApplicationsCountQuery_jobApplicationsConnection;
}
