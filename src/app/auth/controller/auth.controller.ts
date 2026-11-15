import {NextFunction,Request,Response} from "express";
import authService,{AuthService} from "../service/auth.service";

class AuthController {
    private authService : AuthService = authService;
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
}

export default new AuthController();