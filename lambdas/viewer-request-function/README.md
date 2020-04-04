# Viewer Request Function

Lambda used by Cloudfront that parses a request for an asset and ensures that any requested image transform specified by URL query parameters is permitted.

## Update the function on AWS

```sh
yarn deploy # Recursively zips files in src and saves it to viewer-request-function.zip (https://superuser.com/a/351020) and then deploys the zip file to AWS
yarn publish-aws # Publishes a new version of the function to AWS using the latest deployed version
```
