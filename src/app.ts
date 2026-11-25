import express from 'express';
import {router} from "./route";
import {globalErrorHandler} from "./lib/error/error.handler";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use('/api',router)
    app.use(globalErrorHandler);
    return app
}

