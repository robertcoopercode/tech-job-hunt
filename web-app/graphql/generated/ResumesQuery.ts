/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QueryResumesOrderByInput } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: ResumesQuery
// ====================================================

export interface ResumesQuery_resumes_nodes_Versions {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
  VersionId: string;
  createdAt: any;
}

export interface ResumesQuery_resumes_nodes {
  __typename: "Resume";
  id: string;
  name: string;
  updatedAt: any;
  Versions: ResumesQuery_resumes_nodes_Versions[];
}

export interface ResumesQuery_resumes {
  __typename: "QueryResumes_Connection";
  /**
   * Flattened list of Resume type
   */
  nodes: ResumesQuery_resumes_nodes[];
  totalCount: number;
}

export interface ResumesQuery {
  resumes: ResumesQuery_resumes;
}

export interface ResumesQueryVariables {
  first?: number | null;
  skip?: number | null;
  orderBy?: QueryResumesOrderByInput | null;
}
