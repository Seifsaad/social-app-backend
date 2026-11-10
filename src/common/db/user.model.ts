import {model,Schema} from "mongoose";

enum Provider{
    LOCAL =0,
    GOOGLE =1,
    FACEBOOK =2
}

enum Gender{
    MALE =0,
    FEMALE =1
}

interface IUser{
    userName:string,
    email:string,
    password:string,
    provider:Provider,
    gender:Gender,
}

const schema  = new Schema<IUser>({
    userName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        toLowercase: true,
    },
    password:{
        type: String,
        required: function(this){
            return this.provider === Provider.LOCAL;
        },
        trim: true,
    },
    provider:{
        type: Number,
        default: Provider.LOCAL,
        enum: Provider
    }

})

export const User = model("User", schema);