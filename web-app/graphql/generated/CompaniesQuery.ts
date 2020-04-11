/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QueryCompaniesOrderByInput } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: CompaniesQuery
// ====================================================

export interface CompaniesQuery_companies_nodes_Image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  Key: string;
}

export interface CompaniesQuery_companies_nodes {
  __typename: "Company";
  id: string;
  name: string;
  rating: number | null;
  Image: CompaniesQuery_companies_nodes_Image | null;
  jobApplicationsCount: number;
  updatedAt: any;
}

export interface CompaniesQuery_companies {
  __typename: "QueryCompanies_Connection";
  /**
   * Flattened list of Company type
   */
  nodes: CompaniesQuery_companies_nodes[];
  totalCount: number;
}

export interface CompaniesQuery {
  companies: CompaniesQuery_companies;
}

export interface CompaniesQueryVariables {
  orderBy?: QueryCompaniesOrderByInput | null;
  first?: number | null;
  skip?: number | null;
}
