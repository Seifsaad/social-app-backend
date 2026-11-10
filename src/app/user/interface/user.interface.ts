import {Gender, Provider} from "../../auth/enum/enum";

export interface IUser{
    userName:string,
    email:string,
    password:string,
    provider:Provider,
    gender:Gender,
}