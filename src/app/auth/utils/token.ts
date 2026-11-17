import jwt, {JwtPayload} from "jsonwebtoken";
import {toMs} from "../../../pkg/utils/time.js";
import {env} from "../../../lib/config/env.js";
import {IUser} from "../../user/interface/user.interface";
import {TUserPayload} from "../../../lib/interface/userPayload.interface";
import {Response} from "express";

export function generateAccessToken(payload:TUserPayload) {
    return jwt.sign(
        payload, env.jwt.secret,
        { expiresIn: toMs(1, 'hours') }
    );
}

export function generateRefreshToken(payload:TUserPayload) {
    return jwt.sign(
        payload, env.jwt.secret,
        { expiresIn: toMs(7, 'days') }
    );
}



export function setCookies(res:Response, accessToken:string, refreshToken:string) {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: toMs(1, 'hours'),
        path:'/'
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: toMs(7, 'days'),
        path: '/api/auth/refresh-token'
    });
}