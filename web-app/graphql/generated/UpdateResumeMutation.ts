/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateResumeMutation
// ====================================================

export interface UpdateResumeMutation_updateResume {
  __typename: "Resume";
  id: string;
  name: string;
}

export interface UpdateResumeMutation {
  updateResume: UpdateResumeMutation_updateResume;
}

export interface UpdateResumeMutationVariables {
  id: string;
  name: string;
  file?: any | null;
}
