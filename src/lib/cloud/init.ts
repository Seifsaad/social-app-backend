import {S3CloudProvider} from "../../pkg/cloud/s3.cloud";
import {env} from "../config/env";

export const s3CloudProvider = new S3CloudProvider({
    region:env.aws.region,
    secretAccessKey:env.aws.secretKey,
    accessKey:env.aws.accessKey,
    bucketName:env.aws.bucketName,
})