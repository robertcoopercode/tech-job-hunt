const __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable */
const querystring_1 = __importDefault(require('querystring'));
const aws_sdk_1 = __importDefault(require('aws-sdk'));
const sharp_1 = __importDefault(require('sharp'));
const S3 = new aws_sdk_1.default.S3({
    signatureVersion: 'v4',
});
// NOTE: Make sure to update this variable before deploying
const BUCKET = 'tech-job-hunt-dev';
exports.handler = (event, _context, callback) => {
    const { response } = event.Records[0].cf;
    console.log('Response status code :%s', response.status);
    // Check if image is not present
    if (response.status == 404) {
        const { request } = event.Records[0].cf;
        const params = querystring_1.default.parse(request.querystring);
        // If there is no dimension or versionId query param, just pass the response
        if (!params.d || !params.versionId) {
            callback(null, response);
            return;
        }
        // Read the dimension parameter value = width x height and split it by 'x'
        const dimensionMatch = params.d.split('x');
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
            .then((data) => sharp_1.default(data.Body).resize(width, height).toFormat(requiredFormat).toBuffer())
            .then((buffer) => {
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
            .catch((err) => {
                console.log('Exception while reading source image :%j', err);
            });
    } // End of if block checking response statusCode
    else {
        // Allow the response to pass through
        callback(null, response);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvQkFBb0I7QUFDcEIsOERBQXNDO0FBQ3RDLHNEQUEwQjtBQUMxQixrREFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEVBQUUsQ0FBQztJQUNsQixnQkFBZ0IsRUFBRSxJQUFJO0NBQ3pCLENBQUMsQ0FBQztBQUVILDJEQUEyRDtBQUMzRCxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUVsQyxPQUFPLENBQUMsT0FBbUIsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDekQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRXpDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXpELGdDQUFnQztJQUNoQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO1FBQ3hCLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4QyxNQUFNLE1BQU0sR0FBRyxxQkFBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEQsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNoQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLE9BQU87U0FDVjtRQUVELDBFQUEwRTtRQUMxRSxNQUFNLGNBQWMsR0FBSSxNQUFNLENBQUMsQ0FBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztR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
