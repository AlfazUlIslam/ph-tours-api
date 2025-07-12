import dotenv from "dotenv";

dotenv.config();

interface IEnv {
    PORT: string;
    MONGODB_URI: string;
    NODE_ENV: "development" | "production";
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    BCRYPT_SALT_ROUND: string;
};

const loadEnvVariables = (): IEnv => {
    const requiredEnvVariables: string[] = [ 
        "PORT", 
        "MONGODB_URI", 
        "NODE_ENV", 
        "JWT_SECRET", 
        "JWT_EXPIRY", 
        "BCRYPT_SALT_ROUND"
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
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string
    };
};

export const env: IEnv = loadEnvVariables();