import {HydratedDocument, model, Schema} from "mongoose";
import {Gender, Provider} from "../../auth/enum/enum";
import {IUser} from "../interface/user.interface";

export type userDocument = HydratedDocument<IUser>

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
        lowercase: true,
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
    },
    gender:{
        type: Number,
        enum: Gender
    },
    twoStepsVerification:{
        type: Boolean,
        default: false,
    },
    profilePicturePath:String,
    isVerified: {
        type: Boolean,
        default: false,
    },
});

export const User = model("User", schema);