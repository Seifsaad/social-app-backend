import {
    Enable2StepVerificationDto,
    LoginDto,
    RegisterDto,
    SendOtpDto,
    VerifyAccountDto,
    VerifyToLoginDto,
} from "../dto/dto";
import userRepository from "../../user/repository/user.repository";
import {userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified} from "../../user/errors";
import {userDocument} from "../../user/model/user.model";
import {generateOtpCode} from "../../../lib/utils/otp";
import {comparePassword, hashedPassword} from "../utils/hash";
import {cacheProvider} from "../../../lib/cache/init";
import {toSeconds} from "../../../pkg/utils/time";
import {MailProvider} from "../../../pkg/email/mail.interface";
import {mailjetProvider} from "../../../lib/email/init";
import {UserRepository} from "../../user/repository/user.repository";
import {AppError} from "../../../lib/error/error";
import {invalidCode, invalidPassword, otpExpired} from "../errors";
import {generateAccessToken, generateRefreshToken} from "../utils/token";
import {verifyGoogleToken} from "../../../lib/utils/google-auth";
import {Provider} from "../enum/enum";
import jwt from "jsonwebtoken";
import {env} from "../../../lib/config/env";
import {TUserPayload} from "../../../lib/interface/userPayload.interface";

class AuthService {
    private twoStepVerificationKey = '2-step-verification';
    private sendOtpKey = 'otp:';
    private readonly userRepository: UserRepository = userRepository;
    private readonly mailProvider: MailProvider

    constructor() {
        this.mailProvider = mailjetProvider
    }

    private verifyUserOtp = async (email: string, code: string, preCheck?: (user: userDocument) => void) => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw userNotExist;
        preCheck?.(user);
        const cacheKey = `${this.sendOtpKey}${user._id.toString()}`;
        const cacheCode = await cacheProvider.get(cacheKey);
        if (!cacheCode) throw otpExpired;
        if (cacheCode !== code) throw invalidCode;
        return {user, cacheKey};
    }

    private issueTokens = async (user: userDocument) => {
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken({id: user._id, name: user.userName});
        const refreshToken = generateRefreshToken({jti: jti, id: user._id, name: user.userName});
        await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));
        return {accessToken, refreshToken};
    }

    register = async (registerDto: RegisterDto) => {
        const userExist = await this.userRepository.findByEmail(registerDto.email)
        if (userExist) throw userAlreadyExist;
        registerDto.password = await hashedPassword(registerDto.password);
        const createUser = await this.userRepository.create(registerDto)
        console.log(createUser)
        const code = generateOtpCode()
        // await otpRepository.createOTP({
        //     code: code, email: userData.email, expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
        // })
        await cacheProvider.set(`${this.sendOtpKey}${createUser._id.toString()}`, code, toSeconds(3, 'minutes'))
        await this.mailProvider.send(registerDto.email, `verification code`, `<h1>Your verification code is ${code}</h1>`)
        return createUser
    }

    verifyAccount = async (varifyAccountDto: VerifyAccountDto) => {
        const {cacheKey} = await this.verifyUserOtp(varifyAccountDto.email, varifyAccountDto.code, (user) => {
            if (user.isVerified === true) throw userAlreadyVerified;
        });
        const updatedUser = await this.userRepository.update({email: varifyAccountDto.email}, {isVerified: true});
        await cacheProvider.del(cacheKey);
        return updatedUser;
    }

    enable2stepVerification = async (enable2StepDto: Enable2StepVerificationDto) => {
        const {user, cacheKey} = await this.verifyUserOtp(enable2StepDto.email, enable2StepDto.code);
        const updatedUser = await this.userRepository.update({email: user.email}, {twoStepsVerification: true});
        await cacheProvider.del(cacheKey);
        return updatedUser;
    }

    verifyToLogin = async (verifyToLoginDto: VerifyToLoginDto) => {
        const {user, cacheKey} = await this.verifyUserOtp(verifyToLoginDto.email, verifyToLoginDto.code);
        const tokens = await this.issueTokens(user);
        await cacheProvider.del(cacheKey);
        return tokens;
    }

     login=async(loginDto:LoginDto)=> {
        let cachedTries = await cacheProvider.get(`login-tries:${loginDto.email}:login`);
        if (cachedTries === "0") throw new AppError("too many tries", 429)
        const user = await userRepository.findByEmail(loginDto.email);
        if (!user) throw userNotExist;
        if (!user.isVerified) throw userNotVerified;
        const match = await comparePassword(loginDto.password, user['password'])
        if (!match) throw invalidPassword;
        // if (user.twoStepsVerification === true) {
        //     const code = generateOtpCode();
        //     await cacheProvider.set(`otp:${email}`, code, toSeconds(3, 'minutes'));
        //     await mailjetProvider.sendEmail(email, '2 steps verification email code', `<h3>Your OTP to login is ${code}</h3>`)
        //     return;
        // }
        const {accessToken, refreshToken} = await this.issueTokens(user);
        let cachedTTL = await cacheProvider.ttl(`login-tries:${loginDto.email}:login`);
        cachedTries = cachedTries ?? 4;
        const ttl = cachedTTL === -2 ? toSeconds(3, 'minutes') : cachedTTL;
        await cacheProvider.set(`login-tries:${loginDto.email}:login`, String(+cachedTries - 1), ttl);
        return {accessToken, refreshToken};
    }

    sendOtp=async(sendOtpDto:SendOtpDto )=> {
        const user = await this.userRepository.findByEmail(sendOtpDto.email);
        if (!user) throw userNotExist;
        // await otpRepository.deleteOTPsByEmail(email)
        const code = generateOtpCode()
        // await otpRepository.createOTP({
        //     code: code,
        //     email: email,
        //     expiresAt: Date.now() + toMs(3, 'minutes'),
        // })
        await cacheProvider.set(`${this.sendOtpKey}${user._id.toString()}`, code, toSeconds(3, 'minutes'))
        await this.mailProvider.send(sendOtpDto.email, 'new otp', `<p>your new otp is ${code}</p>`)

    }




     loginWithGoogle=async(idToken:string)=> {
        const payload = await verifyGoogleToken(idToken)
        if (!payload) throw new AppError('no payload provided',400)
        const user = await this.userRepository.findByEmail(payload?.email as string);
        if (user) {
            return generateAccessToken({
                id: user._id,
                email: user.email,
            })
        }
        const createUser = await this.userRepository.create({
            userName: payload.name,
            email: payload.email,
            provider: Provider.GOOGLE,
            isVerified: true,
        })
        return generateAccessToken({
            id: createUser._id,
            email: createUser.email
        })
    }

    refreshTokenFn =async(token:string)=> {
        const payload = jwt.verify(token,env.jwt.refreshSecret) as TUserPayload
        const accessToken = generateAccessToken({sub: payload.sub, userName: payload.userName});
        const refreshToken = generateRefreshToken({sub: payload.sub, userName: payload.userName});
        return {
            accessToken,
            refreshToken
        }
    }

}

export default new AuthService()

