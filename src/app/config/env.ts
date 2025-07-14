import dotenv from "dotenv";

dotenv.config();

interface IEnv {
    PORT: string;
    MONGODB_URI: string;
    NODE_ENV: "development" | "production";
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRY: string;
    BCRYPT_SALT_ROUND: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CALLBACK_URL: string;
    EXPRESS_SESSION_SECRET: string;
    FRONTEND_URL: string;
};

const loadEnvVariables = (): IEnv => {
    const requiredEnvVariables: string[] = [ 
        "PORT", 
        "MONGODB_URI", 
        "NODE_ENV", 
        "JWT_SECRET", 
        "JWT_EXPIRY",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRY", 
        "BCRYPT_SALT_ROUND",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CALLBACK_URL",
        "EXPRESS_SESSION_SECRET",
        "FRONTEND_URL"
    ];

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
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRY: process.env.JWT_EXPIRY as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string 
    };
};

export const env: IEnv = loadEnvVariables();