/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCompanyMutation
// ====================================================

export interface CreateCompanyMutation_createCompany {
  __typename: "Company";
  id: string;
}

export interface CreateCompanyMutation {
  createCompany: CreateCompanyMutation_createCompany;
}

export interface CreateCompanyMutationVariables {
  name: string;
  image?: any | null;
}
