/* eslint-disable */
import querystring from 'querystring';
import AWS from 'aws-sdk';
import sharp from 'sharp';
import { Handler } from 'aws-lambda';
const S3 = new AWS.S3({
    signatureVersion: 'v4',
});

// NOTE: Make sure to update this variable before deploying
const BUCKET = 'tech-job-hunt-dev';

(exports.handler as Handler) = (event, _context, callback) => {
    const { response } = event.Records[0].cf;

    console.log('Response status code :%s', response.status);

    // Check if image is not present
    if (response.status == 404) {
        const { request } = event.Records[0].cf;
        const params = querystring.parse(request.querystring);

        // If there is no dimension or versionId query param, just pass the response
        if (!params.d || !params.versionId) {
            callback(null, response);
            return;
        }

        // Read the required path. Ex: uri /users/userId12345/companies/imageName/200x200/webp/imageName.jpg
        const path = request.uri;

        // Read the S3 key from the path variable. (i.e. remove starting slash)
        // Ex: key variable users/userId12345/companies/imageName/200x200/webp/imageName.jpg
        const key = path.substring(1);

        // Get the prefix, width, height and image name from the S3 key
        const match = key.match(/(.*)\/(\d+)x(\d+)\/([^\/]*)\/(.*)/);
        const prefix = match[1]; // users/userId12345/companies/imageName/original
        const width = parseInt(match[2], 10); // 200
        const height = parseInt(match[3], 10); // 200
        // Correction for jpg required for 'Sharp'
        const requiredFormat = match[4] == 'jpg' ? 'jpeg' : match[4]; // webp
        const imageName = match[5]; // imageName.jpg
        const originalKey = `${prefix}/original/${imageName}`; // users/userId12345/companies/imageName/imageName.jpg

        console.log('originalKey', originalKey);

        // Get the source image file
        S3.getObject({ Bucket: BUCKET, Key: originalKey })
            .promise()
            // Perform the resize operation
            .then(data =>
                sharp(data.Body as Buffer)
                    .resize(width, height)
                    .toFormat(requiredFormat)
                    .toBuffer()
            )
            .then(buffer => {
                // Save the resized object to S3 bucket with appropriate object key.
                S3.putObject({
                    Body: buffer,
                    Bucket: BUCKET,
                    ContentType: `image/${requiredFormat}`,
                    CacheControl: 'max-age=31536000',
                    Key: key,
                    StorageClass: 'STANDARD',
                })
                    .promise()
                    // Even if there is exception in saving the object we send back the generated
                    // image back to viewer below
                    .catch(() => {
                        console.log('Exception while writing resized image to bucket');
                    });

                // Generate a binary response with resized image
                response.status = 200;
                response.body = buffer.toString('base64');
                response.bodyEncoding = 'base64';
                response.headers['content-type'] = [{ key: 'Content-Type', value: `image/${requiredFormat}` }];
                callback(null, response);
            })
            .catch(err => {
                console.log('Exception while reading source image :%j', err);
            });
    } // End of if block checking response statusCode
    else {
        // Allow the response to pass through
        callback(null, response);
    }
};
