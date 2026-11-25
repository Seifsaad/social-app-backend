import {AppError} from "../error/error";
import jwt, {JwtPayload} from "jsonwebtoken";
import {env} from "../config/env.js";
import {NextFunction,Request,Response} from "express";


export function authGuard(req:Request, res:Response, next:NextFunction) {
    try {
        const token = req.cookies.access_token;
        if (!token) throw new AppError('No token provided',403);
        req.user = jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
        next();
    }catch (error) {
        next(error);
    }
}