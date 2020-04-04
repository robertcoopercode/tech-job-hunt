/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardUpdateWithoutBillingInfoDataInput } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpgradeUserMutation
// ====================================================

export interface UpgradeUserMutation_upgradeUser {
  __typename: "StripeSubscription";
  status: string;
  clientSecret: string;
}

export interface UpgradeUserMutation {
  upgradeUser: UpgradeUserMutation_upgradeUser;
}

export interface UpgradeUserMutationVariables {
  paymentMethodId: string;
  email: string;
  planId: string;
  card: CardUpdateWithoutBillingInfoDataInput;
}
