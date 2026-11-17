export class AppError extends Error {
    constructor(message:string,public statusCode:number,public isOperational:boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

