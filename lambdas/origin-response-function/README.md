# Origin Response Function

Lambda use by Cloudfront that parses the S3 response and creates a resized image if one does not already exist.

## Installing packages

When installing sharp from NPM, it should be done in an AWS Linux docker container so that sharp installs the correct binaries associated with the operating system where the AWS Lambda function runs.

```bash
docker run -v "$PWD":/var/task lambci/lambda:build-nodejs10.x curl -o- -L https://yarnpkg.com/install.sh | bash && yarn add sharp
```

> Note: The `lambci/lambda:build-nodejs10.x` docker image requires that `yarn` be installed in order to be able to use it, that is why there is a curl command before the `yarn` command in the above `docker run` command.

## Update the function on AWS

```sh
yarn deploy # Recursively zips files in src and saves it to origin-response-function.zip (https://superuser.com/a/351020) and then deploys the zip file to AWS
yarn publish-aws # Publishes a new version of the function to AWS using the latest deployed version
```

## Update code for dev and production

Since CloudFront doesn't allow for the usage of Lambda environment variables, it's required to deploy the code for both production and development with the correct values set for each environment. Currently the only variable that needs to be updated in the code the the bucket name variable.
