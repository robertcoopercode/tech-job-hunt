/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResumeQuery
// ====================================================

export interface ResumeQuery_resume_Versions {
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
  Versions: ResumeQuery_resume_Versions[];
}

export interface ResumeQuery {
  resume: ResumeQuery_resume;
}

export interface ResumeQueryVariables {
  id: string;
}
