/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BillingFrequency } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_me_billing_card {
  __typename: "Card";
  brand: string;
  last4Digits: string;
  expMonth: number;
  expYear: number;
}

export interface CurrentUserQuery_me_billing {
  __typename: "BillingInfo";
  billingFrequency: BillingFrequency | null;
  isPremiumActive: boolean;
  startOfBillingPeriod: number | null;
  endOfBillingPeriod: number | null;
  willCancelAtEndOfPeriod: boolean;
  stripeCustomerId: string | null;
  card: CurrentUserQuery_me_billing_card | null;
}

export interface CurrentUserQuery_me {
  __typename: "User";
  id: string;
  billing: CurrentUserQuery_me_billing | null;
  email: string;
  hasVerifiedEmail: boolean | null;
  hasCompletedOnboarding: boolean;
}

export interface CurrentUserQuery {
  me: CurrentUserQuery_me | null;
}
