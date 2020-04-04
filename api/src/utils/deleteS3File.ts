import { s3 } from './fileUpload';
import S3 = require('aws-sdk/clients/s3');

export const deleteS3Files = ({
    key,
    versionIds,
}: {
    key: string;
    versionIds: string[];
}): Promise<S3.Types.DeleteObjectOutput> => {
    const params = {
        Bucket: process.env.API_AWS_BUCKET_NAME,
        Delete: {
            Objects: versionIds.map(versionId => ({
                Key: key,
                VersionId: versionId,
            })),
        },
    };
    return new Promise((resolve, reject) => {
        s3.deleteObjects(params as S3.DeleteObjectsRequest, function(err, data) {
            if (err) {
                // eslint-disable-next-line no-console
                console.log('Error', err);
                reject(err);
            }
            if (data) {
                // eslint-disable-next-line no-console
                console.log('Deletion Success', data);
                resolve(data);
            }
        });
    });
};
