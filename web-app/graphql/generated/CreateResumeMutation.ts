/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateResumeMutation
// ====================================================

export interface CreateResumeMutation_createResume_versions {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  Key: string;
}

export interface CreateResumeMutation_createResume {
  __typename: "Resume";
  id: string;
  name: string;
  versions: CreateResumeMutation_createResume_versions[] | null;
}

export interface CreateResumeMutation {
  createResume: CreateResumeMutation_createResume;
}

export interface CreateResumeMutationVariables {
  name: string;
  file?: any | null;
}
