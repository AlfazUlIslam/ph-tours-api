import dotenv from "dotenv";

dotenv.config();

interface IEnv {
    PORT: string;
    MONGODB_URI: string;
    NODE_ENV: "development" | "production";
};

const loadEnvVariables = (): IEnv => {
    const requiredEnvVariables: string[] = [ "PORT", "MONGODB_URI", "NODE_ENV"];

    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variable ${key}`);
        };
    });

    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv !== "development" && nodeEnv !== "production") {
        throw new Error(
            `Invalid NODE_ENV value: ${nodeEnv}. Must be "development" or "production".`
        );
    }

    return {
        PORT: process.env.PORT!,
        MONGODB_URI: process.env.MONGODB_URI!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production"
    };
};

export const env: IEnv = loadEnvVariables();