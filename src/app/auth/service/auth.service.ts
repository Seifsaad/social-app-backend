import {LoginDto, RegisterDto, SendOtpDto, VerifyAccountDto} from "../dto/dto";

class AuthService {
    constructor() {
    }
    async register(registerDto:RegisterDto){

    }

    async login(loginDto:LoginDto){

    }

    async sendOtp(sendOtpDto:SendOtpDto){

    }

    async verifyAccount(verifyAccountDto:VerifyAccountDto){

    }

    async forgotPassword(){

    }
}

export default new AuthService();