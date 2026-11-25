import {createApp} from "./app";
import http from "node:http";
import mongoose from "mongoose";
import {connectDB} from "./lib/db/connection";

const app = createApp();

const server = http.createServer(app);

async function startServer() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");
        server.listen(3000, () => console.log("Server running on port 3000"));
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

startServer();

async function shutdown() {
    await mongoose.disconnect();
    server.close();
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);