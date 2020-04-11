# Tech Job Hunt

Monorepo for Tech Job Hunt services. It includes:

- Apollo GraphQL API
- Prisma 2
- Next.js web app
- Lambda functions for image resizing
- S3 Bucket + CloudFront CDN described in CloudFormation template

## Getting started

### API + Prisma + Backing services

Follow the getting started in the [api](./api) directory's README to start a local API server, a local Prisma server, a local MySQL DB, and a local AWS S3 Bucket (using localstack). The aforementioned services need to be running in order for the web app to be run locally.

### Web App

Follow the getting started in the [web app](./web-app) directory's README to start a local server for the web app.
