/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SuggestedResumesQuery
// ====================================================

export interface SuggestedResumesQuery_resumes_nodes_Versions {
  __typename: "AwsFileData";
  id: string;
  cloudfrontUrl: string;
  VersionId: string;
  createdAt: any;
}

export interface SuggestedResumesQuery_resumes_nodes {
  __typename: "Resume";
  id: string;
  name: string;
  Versions: SuggestedResumesQuery_resumes_nodes_Versions[];
}

export interface SuggestedResumesQuery_resumes {
  __typename: "QueryResumes_Connection";
  /**
   * Flattened list of Resume type
   */
  nodes: SuggestedResumesQuery_resumes_nodes[];
}

export interface SuggestedResumesQuery {
  resumes: SuggestedResumesQuery_resumes;
}

export interface SuggestedResumesQueryVariables {
  searchQuery: string;
}
