# Web App

A Next.js application for the web application of Tech Job Hunt.

## Getting started

### Pre-requisites

The following must be installed locally in order to run the web application:

- yarn
- node

### Host file

Add the following line to your `/etc/hosts` file in order to alias your localhost to local.app.techjobhunt.com:

```text
127.0.0.1 local.app.techjobhunt.com
```

### Environment variables

Local environment variables are configured in the `.env` file. Variables set for the `dev` and `prod` environment are configured using the NOW CLI in the `now.json` and `now.prod.json` file. Environment variables are injected into the Next.js app through the `nex.config.js` file.

### Starting the server

```bash
yarn # Install all dependencies
yarn dev # Starts the development server at http://local.app.techjobhunt.com:3000
```

## Local deployments to Zeit Now

In order to deploy to Zeit Now with the `yarn deploy:dev` or `yarn deploy:prod` commands, it's required to have a `now.env.dev` or `now.env.prod` file with the correct environment variables for `NOW_ORG_ID` and `NOW_PROJECT_ID`.
