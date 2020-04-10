/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CompanyQuery
// ====================================================

export interface CompanyQuery_company_Contacts {
  __typename: "CompanyContact";
  email: string | null;
  id: string;
  name: string;
  position: string | null;
  notes: string | null;
  phone: string | null;
  order: number;
}

export interface CompanyQuery_company_Image {
  __typename: "AwsFileData";
  cloudfrontUrl: string;
  fileName: string;
  Key: string;
}

export interface CompanyQuery_company {
  __typename: "Company";
  id: string;
  name: string;
  Contacts: CompanyQuery_company_Contacts[];
  rating: number | null;
  Image: CompanyQuery_company_Image | null;
  website: string | null;
  notes: string | null;
  jobApplicationsCount: number;
}

export interface CompanyQuery {
  company: CompanyQuery_company;
}

export interface CompanyQueryVariables {
  id: string;
}
