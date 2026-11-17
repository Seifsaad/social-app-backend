import {model, Schema, Types} from "mongoose";

export interface IPost {
    content: string,
    userId: Types.ObjectId,
    commentsCount: number,
    reactionsCount: number,
    allowsComments: boolean,
}

const schema = new Schema<IPost>({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    reactionsCount: {
        type: Number,
        default: 0,
    },
});

export const Post = model('Post', schema);