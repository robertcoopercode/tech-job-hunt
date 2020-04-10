/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SuggestedCompanies
// ====================================================

export interface SuggestedCompanies_companies_nodes_Image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
}

export interface SuggestedCompanies_companies_nodes {
  __typename: "Company";
  id: string;
  name: string;
  Image: SuggestedCompanies_companies_nodes_Image | null;
}

export interface SuggestedCompanies_companies {
  __typename: "QueryCompanies_Connection";
  /**
   * Flattened list of Company type
   */
  nodes: SuggestedCompanies_companies_nodes[];
}

export interface SuggestedCompanies {
  companies: SuggestedCompanies_companies;
}

export interface SuggestedCompaniesVariables {
  searchQuery: string;
}
