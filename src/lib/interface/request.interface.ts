import {IUser} from "../../app/user/interface/user.interface";
import {JwtPayload} from "jsonwebtoken";
import {TUserPayload} from "./userPayload.interface";

declare module 'express-serve-static-core' {

    interface Request {
        user?: TUserPayload;
    }
}