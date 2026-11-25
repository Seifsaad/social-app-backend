import {Router} from "express";
import authController from "./controller/auth.controller";

export const authRouter = Router();

authRouter.post('/register',authController.register);
authRouter.post('/send-otp',authController.sendOtp);
authRouter.patch('/verify-account',authController.verifyAccount)
