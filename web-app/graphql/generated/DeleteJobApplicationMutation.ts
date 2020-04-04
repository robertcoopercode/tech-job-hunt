/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteJobApplicationMutation
// ====================================================

export interface DeleteJobApplicationMutation_deleteJobApplication {
  __typename: "JobApplication";
  id: string;
}

export interface DeleteJobApplicationMutation {
  deleteJobApplication: DeleteJobApplicationMutation_deleteJobApplication;
}

export interface DeleteJobApplicationMutationVariables {
  jobId: string;
}
