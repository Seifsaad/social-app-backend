import {NextFunction,Request,Response} from "express";
import userService from "../service/user.service";
import {AppError} from "../../../lib/error/error";

class UserController{
    private readonly userService = userService;

    uploadProfilePicture =async (req:Request, res:Response,next:NextFunction)=>{
        try{
            console.log({file:req.file});
            if (!req.user?.id) throw new AppError("Unauthorized", 401);
            if (!req.file) throw new AppError("File is required", 400);
            await this.userService.uploadProfilePicture(req.file as Express.Multer.File, req.user?.id);
            res.json({message:"profile Picture uploaded successfully",success:true});
        }catch (error){
            next(error);
        }
    }
}

export default new UserController();