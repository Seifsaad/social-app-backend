import {IUser} from "../../app/user/interface/user.interface";
import {JwtPayload} from "jsonwebtoken";

declare module 'express-serve-static-core' {

    interface Request {
        user?: Partial<IUser> | JwtPayload
    }
}