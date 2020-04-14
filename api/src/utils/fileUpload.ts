import AWS from 'aws-sdk';
import uuid from 'uuid/v4';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileUpload } from 'graphql-upload';
import { verifyEnvironmentVariables } from './verifyEnvironmentVariables';

verifyEnvironmentVariables(process.env.API_AWS_ACCESS_KEY_ID, 'API_AWS_ACCESS_KEY_ID');
verifyEnvironmentVariables(process.env.API_AWS_ACCESS_KEY, 'API_AWS_ACCESS_KEY');
verifyEnvironmentVariables(process.env.API_AWS_BUCKET_NAME, 'API_AWS_BUCKET_NAME');

export const credentials = new AWS.Credentials({
    accessKeyId: process.env.API_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.API_AWS_ACCESS_KEY,
});

const isLocalEnvironment = process.env.NODE_ENV === 'development';

export const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    credentials,
    endpoint: isLocalEnvironment ? 'http://localhost:4572' : undefined,
    s3ForcePathStyle: true,
});

const uploadParams: AWS.S3.Types.PutObjectRequest = {
    Bucket: process.env.API_AWS_BUCKET_NAME,
    Key: '',
    Body: '',
    Metadata: { app: 'tech-job-hunt' },
};

type UploadedFileData = {
    fileName: string;
    VersionId: string;
    cloudfrontUrl: string;
    s3Url: string;
} & ManagedUpload.SendData;

export const fileUpload = async ({
    filePathPrefix,
    file,
    userId,
    // Used if uploading a new version of an existing object
    existingObjectKey,
    // Used to determine if the folder name should include [fileName]/original/
    isImage = true,
}: {
    filePathPrefix: string;
    userId: string;
    file?: FileUpload;
    existingObjectKey?: string;
    isImage?: boolean;
}): Promise<UploadedFileData | null> => {
    if (file) {
        const folderName = `users/${userId}/${filePathPrefix}`;

        const parsedFile = await file;
        const stream = parsedFile.createReadStream();
        if ((stream as any)._writeStream.bytesWritten > 10000000) {
            throw Error('File to be uploaded is over 10 MB, which is over the allowable limit');
        }
        // Replaces special characters and spaces by an underscore: https://stackoverflow.com/a/13020280/8360496
        // If we use a space in the filename, it will cause errors with the Cloudfront lambda functions that are in place
        const fileName = `${parsedFile.filename}`.replace(/[^A-Z0-9\.]+/gi, '_');
        uploadParams.Body = stream;

        const isFileExtensionIncluded = fileName.includes('.');

        // Unique ID to append to file name
        const uniqueId = uuid();

        if (existingObjectKey) {
            uploadParams.Key = existingObjectKey;
        } else {
            if (isFileExtensionIncluded) {
                const indexOfFileExtensionPeriod = fileName.lastIndexOf('.');
                const fileNameWithoutExtension = `${fileName.slice(0, indexOfFileExtensionPeriod)}-${uniqueId}`;
                const fileExtensionIncludingPeriod = `${fileName.slice(indexOfFileExtensionPeriod)}`;
                const uploadKey = [folderName];
                if (isImage) {
                    uploadKey.push(fileNameWithoutExtension, 'original');
                }
                uploadKey.push(fileNameWithoutExtension + fileExtensionIncludingPeriod);
                uploadParams.Key = uploadKey.join('/');
            } else {
                const uploadKey = [folderName];
                if (isImage) {
                    uploadKey.push(`${fileName}-${uniqueId}`, 'original');
                }
                uploadKey.push(`${fileName}-${uniqueId}`);
                uploadParams.Key = uploadKey.join('/');
            }
        }

        return new Promise((resolve, reject) => {
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.log('Error', err);
                    reject(err);
                }
                if (data) {
                    // eslint-disable-next-line no-console
                    console.log('Upload Success', data);
                    // For some reason there is both a `key` and `Key` prop returned by Amazon. We only need one so we delete the other property
                    delete (data as any).key;
                    const s3Url = `${data.Location}?versionId=${(data as any).VersionId}`;
                    const cloudfrontUrl = `${process.env.API_CLOUDFRONT_DOMAIN}/${data.Key}?versionId=${
                        (data as any).VersionId
                    }`;
                    resolve({
                        ...data,
                        fileName: parsedFile.filename,
                        s3Url,
                        // Since we can't simulate cloudfront locally, we will save the cloudfrontUrl as the s3Url
                        cloudfrontUrl: isLocalEnvironment ? s3Url : cloudfrontUrl,
                    } as UploadedFileData);
                }
            });
        });
    }
    return Promise.resolve(null);
};
