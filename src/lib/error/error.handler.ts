import {AppError} from "./error";
import {NextFunction,Request,Response} from "express";

export function globalErrorHandler(err:AppError, req:Request, res:Response, next:NextFunction){
        if(err.isOperational) {
            return  res.status(err.statusCode).json({
                message: err.message,
                success: false,
                stack: err.stack
            })
        }
        return res.status(500).json({
            error: 'something went wrong',
            success: false,
            message: err.message,
        })
    }
