/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ResumeOrderByInput } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: ResumesQuery
// ====================================================

export interface ResumesQuery_resumesConnection_edges_node_versions {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  VersionId: string;
  createdAt: any;
  fileName: string;
}

export interface ResumesQuery_resumesConnection_edges_node {
  __typename: "Resume";
  id: string;
  name: string;
  updatedAt: any;
  versions: ResumesQuery_resumesConnection_edges_node_versions[] | null;
}

export interface ResumesQuery_resumesConnection_edges {
  __typename: "ResumeEdge";
  node: ResumesQuery_resumesConnection_edges_node;
}

export interface ResumesQuery_resumesConnection {
  __typename: "ResumeConnection";
  edges: ResumesQuery_resumesConnection_edges[];
}

export interface ResumesQuery_resumesTotal_aggregate {
  __typename: "AggregateResume";
  count: number;
}

export interface ResumesQuery_resumesTotal {
  __typename: "ResumeConnection";
  aggregate: ResumesQuery_resumesTotal_aggregate;
}

export interface ResumesQuery {
  resumesConnection: ResumesQuery_resumesConnection;
  resumesTotal: ResumesQuery_resumesTotal;
}

export interface ResumesQueryVariables {
  orderBy?: ResumeOrderByInput | null;
  first?: number | null;
  skip?: number | null;
}
