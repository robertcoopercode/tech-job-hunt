/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SuggestedResumesQuery
// ====================================================

export interface SuggestedResumesQuery_me_resumes_versions {
  __typename: "AwsFileData";
  id: string;
  cloudfrontUrl: string;
  VersionId: string;
  createdAt: any;
}

export interface SuggestedResumesQuery_me_resumes {
  __typename: "Resume";
  id: string;
  name: string;
  versions: SuggestedResumesQuery_me_resumes_versions[] | null;
}

export interface SuggestedResumesQuery_me {
  __typename: "User";
  id: string;
  resumes: SuggestedResumesQuery_me_resumes[] | null;
}

export interface SuggestedResumesQuery {
  me: SuggestedResumesQuery_me | null;
}

export interface SuggestedResumesQueryVariables {
  searchQuery: string;
}
