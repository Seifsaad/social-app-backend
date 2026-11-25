import mongoose from "mongoose";
import {env} from "../config/env";


export async function connectDB(): Promise<typeof mongoose> {
    return mongoose.connect(env.db.url);
}