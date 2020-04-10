# API

A Node.js GraphQL server built with [GraphQL Yoga](https://github.com/prisma/graphql-yoga).

## Getting started

### Pre-requisites

The following must be installed locally in order to run the api and it's backing services:

- yarn (https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- node (https://nodejs.org/en/download/)
- docker engine (https://docs.docker.com/install/)
- docker compose cli (https://docs.docker.com/compose/install/)
- aws cli (https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

### Host file

Add the following line to your `/etc/hosts` file in order to alias your localhost to local.app.techjobhunt.com:

```text
127.0.0.1 local.app.techjobhunt.com
```

### Environment variables

Local environment variables are set in the `.env` file.

### Starting the server

Run the following commands to get started.

```bash
yarn # Install all dependencies
yarn dev # Starts the local api server accessible at http://local.api.techjobhunt.com:4000
```

### S3

In order to save files to S3 locally, we need to setup a local S3 bucket. Run the following commands to do so:

```bash
aws --endpoint-url=http://localhost:4572 s3 mb s3://local-bucket # Creates the s3 bucket locally
aws --endpoint-url=http://localhost:4572 s3api put-bucket-acl --bucket local-bucket --acl public-read # Allows the read/write access to the bucket
aws --endpoint-url=http://localhost:4572 s3api put-bucket-versioning --bucket local-bucket --versioning-configuration Status=Enabled # Enable file versioning
```

### Dealing with Stripe subscriptions

In order to handle Stripe webhooks that are triggered when a user upgrades to premium, or cancels their subscription, the Stripe CLI should be used to listen to incoming Stripe webhooks to the local server. Run `yarn stripe` to handle this. If upgrading a user to premium using a fake credit card (see the [Stripe docs](https://stripe.com/docs/billing/subscriptions/set-up-subscription#test-integration) for the card numbers that will work), it won't be possible to cancel the user subscription through the UI (it will have to be done through the Prisma GraphQL playground to access the DB directly).

Make sure that if you're running stripe locally, that you get a webhook secret by executing `yarn stripe` and copy/pasting it in the `.env` file, otherwise the API won't be able to read the stripe event.

## GraphQL Playground

Once the GraphQL API server is running, visit http://local.api.techjobhunt.com:4000/ to view the GraphQL playground. The playground allows for calls to queries and mutations that have been defined in this repository.

## Prisma & Nexus

This project uses [Prisma](https://www.prisma.io/) to generate a CRUD API to interact with the back-end database. Nexus is used to generate a fully typed back-end API.

```bash
yarn generate # Generates the prisma API, API graphql schema, and API types
yarn generate:prisma # Generates the prisma API
yarn generate:nexus # Generates a graphql schema and types for the API
```

## Deployment

### GraphQL Server

The graphql server api is deployed on Digital Ocean. The CI is setup to automatically deploy the API to dev (https://dev.api.techjobhunt.com) and merges to master. Tagging a commit on master with a new version will trigger the CI to deploy the API to prod (https://api.dev.techjobhunt.com).
