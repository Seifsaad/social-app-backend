import {ICloudProvider} from "./cloud.interface";
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

interface S3config{
    region:string;
    accessKey:string;
    secretAccessKey:string;
    bucketName:string;
}

export class S3CloudProvider implements ICloudProvider {
    private client: S3Client;
    private readonly bucketName: string;
    constructor(config:S3config) {
        this.client =new S3Client({
            region:config.region,
            credentials:{
                accessKeyId:config.accessKey,
                secretAccessKey:config.secretAccessKey
            }
        })
        this.bucketName = config.bucketName
    }

    public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket:this.bucketName,
            Key:key,
        });
        await this.client.send(command);
    }

    public getFile(key: string): Promise<Buffer> {
        // const command = new GetObjectCommand({
        //     Bucket:this.bucketName,
        //     Key:key,
        // })
        // this.client.send(command)
        return  Promise.resolve(new Buffer('88'))
    }

    public async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket:this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${path}/${new Date().toISOString()}-${file.originalname}`
        });
        await this.client.send(command);
        return command.input.Key as string ;
    }

}