import {AppError} from "../../lib/error/error";

export const otpExpired = new AppError("OTP expired,please resend OTP",404)
export const invalidCode = new AppError("Invalid code",400)
export const invalidPassword = new AppError("Invalid password",403)