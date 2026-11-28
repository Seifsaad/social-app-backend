import {NextFunction,Request,Response} from "express";
import userService from "../service/user.service";
import {AppError} from "../../../lib/error/error";

class UserController{
    private readonly userService = userService;

    uploadProfilePicture =async (req:Request, res:Response,next:NextFunction)=>{
        try{
            // if (!req.user?.id) throw new AppError("Unauthorized", 401);
            if (!req.file) throw new AppError("File is required", 400);
            await this.userService.uploadProfilePicture(req.file as Express.Multer.File, '6b0993337d53e6257b3271e6');
            res.json({message:"profile Picture uploaded successfully",success:true});
        }catch (error){
            next(error);
        }
    }

    generatePresignedUrl = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const {fileName,contentType}=req.body ?? {};
            if (!fileName || !contentType) throw new AppError("fileName and contentType are required", 400);
            const url = await this.userService.generatePresignedUrl({
                originalname:fileName,
                mimetype:contentType,
            },'6b0993337d53e6257b3271e6');
            res.json({message:'OK',success:true,data: {url}});
        }catch (error){
            next(error);
        }
    }

    deleteProfilePic= async (req:Request,res:Response,next:NextFunction)=>{
        try {
            await this.userService.deleteProfilePic('6b0993337d53e6257b3271e6');
            res.json({message:"profile Picture deleted successfully",success:true});
        }catch (error){
            next(error);
        }
    }
}

export default new UserController();