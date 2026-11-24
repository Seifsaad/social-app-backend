export interface ICloudProvider {

    uploadFile(file: Express.Multer.File,path:string):Promise<string>;

    deleteFile(key:string):Promise<void>;

    getFile(key:string):Promise<Buffer>;
}