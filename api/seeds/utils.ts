export const createFileObject = ({ fileName, key, versionId }): any => ({
    s3Url: `https://${process.env.API_AWS_BUCKET_NAME}.s3.amazonaws.com/${key}?versionId=${versionId}`,
    cloudfrontUrl: `${process.env.API_CLOUDFRONT_DOMAIN}/${key}?versionId=${versionId}`,
    Bucket: process.env.API_AWS_BUCKET_NAME,
    fileName,
    Location: `https://${process.env.API_AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    Key: key,
    ETag: '08e64b2e73b4210f4b66450f3503dfac',
    VersionId: versionId,
});
