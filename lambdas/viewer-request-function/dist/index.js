const __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable */
const querystring_1 = __importDefault(require('querystring'));
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
exports.handler = (event, context, callback) => {
    const { request } = event.Records[0].cf;
    const { headers } = request;
    // Parse the query strings key-value pairs. Example: d=72x72
    const params = querystring_1.default.parse(request.querystring);
    // Get version ID from querystring. Note, currently not using versioned images, so nothing is being done with this variable.
    const versionId = params.versionId;
    // Get the uri of original image
    let fwdUri = request.uri;
    // If there is no dimension attribute, just pass the request along to S3
    if (!params.d) {
        callback(null, request);
        return;
    }
    // Read the dimension parameter value = width x height and split it by 'x'
    const dimensionMatch = params.d.split('x');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvQkFBb0I7QUFDcEIsOERBQXNDO0FBR3RDLE1BQU0sU0FBUyxHQUFHO0lBQ2QsaUhBQWlIO0lBQ2pILHdHQUF3RztJQUN4RyxnQ0FBZ0M7SUFDaEMsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3BDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ2xDLHFHQUFxRztJQUNyRyxRQUFRLEVBQUUsRUFBRTtJQUNaLGFBQWEsRUFBRSxNQUFNO0NBQ3hCLENBQUM7QUFFRCxPQUFPLENBQUMsT0FBbUIsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDeEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3hDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFNUIsNERBQTREO0lBQzVELE1BQU0sTUFBTSxHQUFHLHFCQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV0RCw0SEFBNEg7SUFDNUgsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUVuQyxnQ0FBZ0M7SUFDaEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUV6Qix3RUFBd0U7SUFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7UUFDWCxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE9BQU87S0FDVjtJQUVELDBFQUEwRTtJQUMxRSxNQUFNLGNBQWMsR0FBSSxN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
