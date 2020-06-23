/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_me {
  __typename: "User";
  id: string;
  email: string;
  hasVerifiedEmail: boolean | null;
  hasCompletedOnboarding: boolean;
}

export interface CurrentUserQuery {
  me: CurrentUserQuery_me | null;
}
