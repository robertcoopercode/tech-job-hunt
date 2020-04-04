/* eslint-disable */
import querystring from 'querystring';
import { Handler } from 'aws-lambda';

const variables = {
    // Add more dimensions for images as the front-end of the app starts using more different sized images. We want a
    // whitelist to prevent people from requesting any size they want and polluting the S3 bucket with image
    // sizes that will never be used
    allowedDimension: [{ w: 72, h: 72 }],
    defaultDimension: { w: 72, h: 72 },
    // Allowable percentage offset for the requested image. Will then match with a whitelisted dimension.
    variance: 20,
    webpExtension: 'webp',
};

(exports.handler as Handler) = (event, context, callback) => {
    const { request } = event.Records[0].cf;
    const { headers } = request;

    // Parse the query strings key-value pairs. Example: d=72x72
    const params = querystring.parse(request.querystring);

    // Get the uri of original image
    let fwdUri = request.uri;

    // If there is no dimension attribute, just pass the request along to S3
    if (!params.d) {
        callback(null, request);
        return;
    }

    // Read the dimension parameter value = width x height and split it by 'x'
    const dimensionMatch = (params.d as string).split('x');

    // Extract the width and height from the dimensions
    let width = parseInt(dimensionMatch[0]);
    let height = parseInt(dimensionMatch[1]);

    // Parse the prefix, image name and extension from the uri.
    // Example: /users/12345/companies/companyId/original/imageName.jpg

    const match = fwdUri.match(/(.*)(?:\/original\/)(.*)\.([^\?.]*)(?:.*)/);

    const prefix = match[1];
    const imageName = match[2];
    const extension = match[3];

    // Define variable to be set to true if requested dimension is allowed.
    let matchFound = false;

    // Calculate the acceptable variance. If image dimension is 80 and is within acceptable
    // range, then in our case, the dimension would be corrected to 72.
    const variancePercent = variables.variance / 100;

    for (const dimension of variables.allowedDimension) {
        const minWidth = dimension.w - dimension.w * variancePercent;
        const maxWidth = dimension.w + dimension.w * variancePercent;
        if (width >= minWidth && width <= maxWidth) {
            width = dimension.w;
            height = dimension.h;
            matchFound = true;
            break;
        }
    }

    // If no match is found from allowed dimension with variance then set to default
    // dimensions.
    if (!matchFound) {
        width = variables.defaultDimension.w;
        height = variables.defaultDimension.h;
    }

    // Read the accept header to determine if webp is supported.
    const accept = headers['accept'] ? headers['accept'][0].value : '';

    const uri = [];

    // Build the new uri to be forwarded upstream
    uri.push(prefix);
    uri.push(`${width}x${height}`);

    // check support for webp
    if (accept.includes(variables.webpExtension)) {
        uri.push(variables.webpExtension);
    } else {
        uri.push(extension);
    }
    uri.push(`${imageName}.${extension}`);

    fwdUri = uri.join('/');

    // Final modified uri is of format /users/userId12345/companies/imageName/200x200/webp/imageName.jpg
    request.uri = fwdUri;

    console.log('Transformed URI: ', fwdUri);

    callback(null, request);
};
