import {Gender, Provider} from "../../auth/enum/enum";

export interface IUser{
    userName:string,
    email:string,
    password:string,
    phoneNumber?: string,
    provider?:Provider,
    gender?:Gender,
    isVerified?:boolean,
    isDeleted?:boolean,
    profilePicturePath?:string,
}