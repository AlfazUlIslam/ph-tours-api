import { Server } from "http";
import app from "./app";
import connectDatabase from "./app/config/db";
import { env } from "./app/config/env";

const port = env.PORT;
const databaseUri = env.MONGODB_URI as string;

let server: Server;

const startServer = () => {
    connectDatabase(databaseUri);
    
    server = app.listen(port, () => console.log(`App listening on port: ${port}`));
};

startServer();

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved. Server shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };

    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    console.log("Unhandled rejection detected. Server shutting down...\n", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };

    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.log("Uncaught exception detected. Server shutting down...\n", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };

    process.exit(1);
});

// Promise.reject(new Error("Error"));