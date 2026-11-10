import mongoose from "mongoose";
import  {env} from "../config/env";

mongoose.connect(env.db.url)