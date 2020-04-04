/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CompanyQuery
// ====================================================

export interface CompanyQuery_company_contacts {
  __typename: "CompanyContact";
  email: string | null;
  id: string;
  name: string;
  position: string | null;
  notes: string | null;
  phone: string | null;
  order: number;
}

export interface CompanyQuery_company_image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
  Key: string;
}

export interface CompanyQuery_company {
  __typename: "Company";
  id: string;
  name: string;
  contacts: CompanyQuery_company_contacts[] | null;
  rating: number | null;
  image: CompanyQuery_company_image | null;
  website: string | null;
  notes: string | null;
  jobApplicationsCount: number;
}

export interface CompanyQuery {
  company: CompanyQuery_company | null;
}

export interface CompanyQueryVariables {
  id: string;
}
