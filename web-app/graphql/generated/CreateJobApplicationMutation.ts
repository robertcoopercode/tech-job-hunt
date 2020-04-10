/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GoogleMapsLocationUpdateInput } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateJobApplicationMutation
// ====================================================

export interface CreateJobApplicationMutation_createJobApplication {
  __typename: "JobApplication";
  id: string;
}

export interface CreateJobApplicationMutation {
  createJobApplication: CreateJobApplicationMutation_createJobApplication;
}

export interface CreateJobApplicationMutationVariables {
  companyId: string;
  position: string;
  location?: GoogleMapsLocationUpdateInput | null;
  isRemote: boolean;
}
