import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import connectDatabase from "./app/config/db";

dotenv.config();

const port = process.env.PORT;
const databaseUri = process.env.DATABASE_URI as string;

connectDatabase(databaseUri);

let server: Server;
server = app.listen(port, () => console.log(`App listening on port: ${port}`));

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