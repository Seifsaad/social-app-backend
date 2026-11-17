import {JwtPayload} from "jsonwebtoken";
import {IUser} from "../../app/user/interface/user.interface";

export type TUserPayload = JwtPayload & Partial<IUser>