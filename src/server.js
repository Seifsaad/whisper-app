import http from "node:http";
import {createApp} from "./app.js";
import {env} from "./lib/config/env.js";
import mongoose from "mongoose";
import {logger} from "./pkg/logger/logger.js";

const app = createApp()
const server = http.createServer(app)

function shutdown() {
    server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
    });
}

process.on( 'SIGINT', shutdown)
process.on('SIGTERM', shutdown)

 
server.listen(3000,()=>{
    logger.info(`server started on ${3000} `);
})