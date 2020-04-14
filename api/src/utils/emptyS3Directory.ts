import { S3 } from 'aws-sdk';
import { s3 } from './fileUpload';
import { verifyEnvironmentVariables } from './verifyEnvironmentVariables';

export async function emptyS3Directory(dir: string): Promise<void> {
    verifyEnvironmentVariables(process.env.API_AWS_BUCKET_NAME, 'API_AWS_BUCKET_NAME');

    const listParams = {
        Bucket: process.env.API_AWS_BUCKET_NAME,
        Prefix: dir,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents === undefined || listedObjects.Contents.length === 0) {
        return;
    }

    const deleteParams: S3.Types.DeleteObjectsRequest = {
        Bucket: process.env.API_AWS_BUCKET_NAME,
        Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
        if (Key !== undefined) {
            deleteParams.Delete.Objects.push({ Key });
        }
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) {
        await emptyS3Directory(dir);
    }
}
