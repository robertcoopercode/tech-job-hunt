/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardUpdateWithoutBillingInfoDataInput } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCreditCardMutation
// ====================================================

export interface UpdateCreditCardMutation_updateCreditCard {
  __typename: "User";
  id: string;
}

export interface UpdateCreditCardMutation {
  updateCreditCard: UpdateCreditCardMutation_updateCreditCard;
}

export interface UpdateCreditCardMutationVariables {
  card: CardUpdateWithoutBillingInfoDataInput;
}
