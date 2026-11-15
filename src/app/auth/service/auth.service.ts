import {LoginDto, RegisterDto, SendOtpDto, VerifyAccountDto} from "../dto/dto";
import userRepository from "../../user/repository/user.repository";
import bcrypt from 'bcrypt';

export class AuthService {
    constructor() {
    }
    async register(registerDto:RegisterDto){
        const user = await userRepository.getOne({email:registerDto.email});
        if(user) throw new Error('User already exists');
        registerDto.password = await bcrypt.hash(registerDto.password, 10);
        const createdUser =await userRepository.create(registerDto);
        createdUser.password='';
        return createdUser;
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