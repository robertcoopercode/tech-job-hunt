/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SuggestedCompanies
// ====================================================

export interface SuggestedCompanies_me_companies_image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
}

export interface SuggestedCompanies_me_companies {
  __typename: "Company";
  id: string;
  name: string;
  image: SuggestedCompanies_me_companies_image | null;
}

export interface SuggestedCompanies_me {
  __typename: "User";
  id: string;
  companies: SuggestedCompanies_me_companies[] | null;
}

export interface SuggestedCompanies {
  me: SuggestedCompanies_me | null;
}

export interface SuggestedCompaniesVariables {
  searchQuery: string;
}
