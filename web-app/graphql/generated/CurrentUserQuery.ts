/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BillingFrequency } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_me_Billing_Card {
  __typename: "Card";
  brand: string;
  last4Digits: string;
  expMonth: number;
  expYear: number;
}

export interface CurrentUserQuery_me_Billing {
  __typename: "BillingInfo";
  billingFrequency: BillingFrequency | null;
  isPremiumActive: boolean;
  startOfBillingPeriod: number | null;
  endOfBillingPeriod: number | null;
  willCancelAtEndOfPeriod: boolean;
  stripeCustomerId: string | null;
  Card: CurrentUserQuery_me_Billing_Card | null;
}

export interface CurrentUserQuery_me {
  __typename: "User";
  id: string;
  Billing: CurrentUserQuery_me_Billing | null;
  email: string;
  hasVerifiedEmail: boolean | null;
  hasCompletedOnboarding: boolean;
}

export interface CurrentUserQuery {
  me: CurrentUserQuery_me | null;
}
