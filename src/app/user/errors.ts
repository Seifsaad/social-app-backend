import {AppError} from "../../lib/error/error";

export const userNotExist = new AppError("User does not exist",404)
export const userAlreadyExist = new AppError("User Already exist",409)
export const userAlreadyVerified = new AppError("User already verified",400)
export const userNotVerified = new AppError("User not verified",403)