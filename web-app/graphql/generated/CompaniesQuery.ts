/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CompanyOrderByInput } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: CompaniesQuery
// ====================================================

export interface CompaniesQuery_companiesConnection_edges_node_image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  Key: string;
}

export interface CompaniesQuery_companiesConnection_edges_node {
  __typename: "Company";
  id: string;
  name: string;
  rating: number | null;
  image: CompaniesQuery_companiesConnection_edges_node_image | null;
  jobApplicationsCount: number;
  updatedAt: any;
}

export interface CompaniesQuery_companiesConnection_edges {
  __typename: "CompanyEdge";
  node: CompaniesQuery_companiesConnection_edges_node;
}

export interface CompaniesQuery_companiesConnection {
  __typename: "CompanyConnection";
  edges: CompaniesQuery_companiesConnection_edges[];
}

export interface CompaniesQuery_companiesTotal_aggregate {
  __typename: "AggregateCompany";
  count: number;
}

export interface CompaniesQuery_companiesTotal {
  __typename: "CompanyConnection";
  aggregate: CompaniesQuery_companiesTotal_aggregate;
}

export interface CompaniesQuery {
  companiesConnection: CompaniesQuery_companiesConnection;
  companiesTotal: CompaniesQuery_companiesTotal;
}

export interface CompaniesQueryVariables {
  orderBy?: CompanyOrderByInput | null;
  first?: number | null;
  skip?: number | null;
}
