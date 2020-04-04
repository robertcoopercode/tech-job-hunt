import { s3 } from './fileUpload';

export async function emptyS3Directory(dir: string): Promise<void> {
    const listParams = {
        Bucket: process.env.API_AWS_BUCKET_NAME,
        Prefix: dir,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) {
        return;
    }

    const deleteParams = {
        Bucket: process.env.API_AWS_BUCKET_NAME,
        Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) {
        await emptyS3Directory(dir);
    }
}
