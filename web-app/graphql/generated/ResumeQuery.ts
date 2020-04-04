/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResumeQuery
// ====================================================

export interface ResumeQuery_resume_versions {
  __typename: "AwsFileData";
  fileName: string;
  cloudfrontUrl: string;
  VersionId: string;
  createdAt: any;
}

export interface ResumeQuery_resume {
  __typename: "Resume";
  id: string;
  name: string;
  updatedAt: any;
  versions: ResumeQuery_resume_versions[] | null;
}

export interface ResumeQuery {
  resume: ResumeQuery_resume | null;
}

export interface ResumeQueryVariables {
  id: string;
}
