/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CompanyContactCreateWithoutCompanyInput } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCompanyMutation
// ====================================================

export interface UpdateCompanyMutation_updateCompany {
  __typename: "Company";
  id: string;
}

export interface UpdateCompanyMutation {
  updateCompany: UpdateCompanyMutation_updateCompany;
}

export interface UpdateCompanyMutationVariables {
  name: string;
  website?: string | null;
  rating?: number | null;
  contacts?: CompanyContactCreateWithoutCompanyInput[] | null;
  file?: any | null;
  notes?: string | null;
  id: string;
  isCompanyImageUpdated: boolean;
}
