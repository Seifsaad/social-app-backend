import {AppError} from "./error";
import {NextFunction,Request,Response} from "express";

export function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError && err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
            stack: err.stack
        });
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({
        error: 'something went wrong',
        success: false,
        message,
    });
}