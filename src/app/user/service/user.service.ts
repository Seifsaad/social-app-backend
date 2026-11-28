import {ICloudProvider} from "../../../pkg/cloud/cloud.interface";
import userRepository from "../repository/user.repository";
import {s3CloudProvider} from "../../../lib/cloud/init";
import * as fs from "node:fs";
import {AppError} from "../../../lib/error/error";

class UserService{
    private readonly cloudProvider :ICloudProvider = s3CloudProvider;
    private readonly userRepository = userRepository

    uploadProfilePicture= async (file: Express.Multer.File,userId:string)=>{
        file.buffer = fs.readFileSync(file.path);
        const key = await this.cloudProvider.uploadFile(file,`users/${userId}`);
        await this.userRepository.update({_id:userId},{profilePicturePath:key});
    }

    generatePresignedUrl= async (file: Partial<Express.Multer.File>, userId:string)=>{
        return await this.cloudProvider.generatePresignedUrl(file,`users/${userId}`);
    }

    deleteProfilePic= async (userId:string)=>{
        const user = await userRepository.getOne({_id:userId});
        if (!user?.profilePicturePath){
            throw new AppError('Profile Pic not found',404);
        }
        await this.cloudProvider.deleteFile(user?.profilePicturePath);
        await this.userRepository.update({_id:userId},{$unset:{profilePicturePath:''}});
    }
}

export default new UserService();