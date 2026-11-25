import {NextFunction,Request,Response} from "express";
import authService from "../service/auth.service";
import {AppError} from "../../../lib/error/error";

class AuthController {
    private authService = authService;
    constructor() {
    }

    register = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({message:'user created successfully',success:true,data:user});
        }catch (error){
            next(error);
        }
    }

    sendOtp = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { email } = req.body ?? {};
            if (!email) throw new AppError('email is required', 400);
            await this.authService.sendOtp({ email });
            res.status(200).json({message:'user otp sent successfully',success:true});
        }catch (error){
            next(error);
        }
    }

    verifyAccount = async (req: Request, res: Response, next:NextFunction) => {
        try {
            const { email, code } = req.body ?? {};
            if (!email || !code) throw new AppError('email and code are required', 400);
            const user = await this.authService.verifyAccount({ email, code });
            res.status(200).json({message:'user verification success',success:true,data:user});
        }catch (error){
            next(error);
        }
    }

}

export default new AuthController();