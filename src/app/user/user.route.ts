import {Router} from "express";
import {multerUploadSingle} from "../../lib/media/multer";
import userController from "./controller/user.controller";

export const userRouter = Router();

userRouter.post('/upload-profile-pic',multerUploadSingle( 'pp'),userController.uploadProfilePicture)
