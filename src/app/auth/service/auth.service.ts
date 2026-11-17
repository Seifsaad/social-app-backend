import {RegisterDto} from "../dto/dto";
import userRepository from "../../user/repository/user.repository";
import { userAlreadyExist } from "../../user/errors";
import { generateOtpCode } from "../../../lib/utils/otp";
import { hashedPassword } from "../utils/hash";
import { cacheProvider } from "../../../lib/cache/init";
import {toSeconds} from "../../../pkg/utils/time";
import {MailProvider} from "../../../pkg/email/mail.interface";
import {mailjetProvider} from "../../../lib/email/init";
import {UserRepository} from "../../user/repository/user.repository";

export class AuthService {
    private twoStepVerificationKey ='2-step-verification';
    private sendOtpKey ='otp:';
    private readonly userRepository:UserRepository = userRepository;
    private readonly mailProvider:MailProvider
    constructor() {
        this.mailProvider = mailjetProvider
    }

     register= async (registerDto:RegisterDto)=> {
        const userExist = await this.userRepository.findByEmail(registerDto.email)
        if (userExist) throw userAlreadyExist;
        registerDto.password = await hashedPassword(registerDto.password);
        const createUser = await this.userRepository.create(registerDto)
        console.log(createUser)
        const code = generateOtpCode()
        // await otpRepository.createOTP({
        //     code: code, email: userData.email, expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
        // })
        await cacheProvider.set(`otp:${registerDto.email}`, code, toSeconds(3, 'minutes'))
        await this.mailProvider.send(registerDto.email, `verification code`, `<h1>Your verification code is ${code}</h1>`)
        return createUser
    }

    async varifyAccount(email, code) {
        const updatedUser = verifyFn(email, code,
            async(user)
        {
            if (user.isVerified === true) throw new AppError('User already verified');
            const updatedUser = await userRepository.updateUserByEmail(user.email, {isVerified: true});
            return updatedUser;
        }
    )
        ;
        return updatedUser
    }

    async enable2stepVerification(email, code) {
        const updatedUser = verifyFn(email, code, async(user)
        {
            const updatedUser = await userRepository.updateUserByEmail(user.email, {twoStepsVerification: true});
            return updatedUser;
        }
    )
        ;
        return updatedUser
    }

    async verifyToLogin(email, code) {

        const {accessToken, refreshToken} = await verifyFn(email, code, async(user)
        {
            const jti = crypto.randomUUID();
            const accessToken = generateAccessToken({sub: user._id, name: user.name});
            const refreshToken = generateRefreshToken({jti: jti, sub: user._id, name: user.name});
            await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));
            return {accessToken, refreshToken};
        }
    )
        ;
        return {accessToken, refreshToken};
    }

    async login(email, password) {
        let cachedTries = await cacheProvider.get(`login-tries:${email}`);
        if (cachedTries === "0") throw new AppError("too many tries", 429)
        const user = await authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;
        if (!user.isVerified) throw userNotVerified;
        const match = await comparePassword(password, user['password'])
        if (!match) throw invalidPassword;
        if (user.twoStepsVerification === true) {
            const code = generateOtpCode();
            await cacheProvider.set(`otp:${email}`, code, toSeconds(3, 'minutes'));
            await mailjetProvider.sendEmail(email, '2 steps verification email code', `<h3>Your OTP to login is ${code}</h3>`)
            return;
        }
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken({sub: user._id, name: user.name});
        const refreshToken = generateRefreshToken({jti: jti, sub: user._id, name: user.name});
        await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));
        let cachedTTL = await cacheProvider.ttl(`login-tries:${email}`);
        cachedTries = cachedTries ?? 4;
        const ttl = cachedTTL === -2 ? toSeconds(3, 'minutes') : cachedTTL;
        await cacheProvider.set(`login-tries:${email}`, cachedTries - 1, ttl);
        return {accessToken, refreshToken};
    }

    async sendOtp(email) {
        const user = await authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;
        await otpRepository.deleteOTPsByEmail(email)
        const code = generateOtpCode()
        // await otpRepository.createOTP({
        //     code: code,
        //     email: email,
        //     expiresAt: Date.now() + toMs(3, 'minutes'),
        // })
        await cacheProvider.set(`otp:${email}`, code, toMs(3, 'minutes'))
        await mailjetProvider.sendEmail(email, 'new otp', `<p>your new otp is ${code}</p>`)

    }

    async resetPassword(email, code, newPassword) {
        const otp = await otpRepository.getOtpByEmail(email);
        if (!otp) throw otpExpired;
        if (otp !== code) throw invalidCode;
        const hashPassword = await hashedPassword(newPassword);
        await userRepository.updateUserByEmail(email, {password: hashPassword})
        await otpRepository.deleteOTPsByEmail(email)
    }


    async loginWithGoogle(idToken) {
        const payload = await verifyGoogleToken(idToken)
        const user = await authRepository.checkUserExistByEmail(payload.email);
        if (user) {
            return generateAccessToken({
                id: user._id,
                email: user.email,
            })
        }
        const createUser = await authRepository.createUser({
            name: payload.name,
            email: payload.email,
            provider: 'google',
            isVerified: true,
        })
        return generateAccessToken({
            id: createUser._id,
            email: createUser.email
        })
    }

    async refreshTokenFn(token) {
        const payload = verifyRefreshToken(token);
        const tokenJti = await cacheProvider.get(`refreshToken:${payload.jti}`);// 1 - 0
        if (!tokenJti) {
            throw new AppError('used refresh token', 400);
        }
        await cacheProvider.del(`refreshToken:${payload.jti}`);
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken({sub: payload.sub, name: payload.name});
        const refreshToken = generateRefreshToken({sub: payload.sub, name: payload.name, jti: jti});
        await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));
        return {
            accessToken,
            refreshToken
        }
    }

}



