import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

const checkAuth = (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                throw new AppError(403, "No token recieved");
            };

            // const verifiedToken = jwt.verify(accessToken, "secret");
            const verifiedToken = verifyToken(accessToken, env.JWT_SECRET) as JwtPayload;

            if (!verifiedToken) {
                throw new AppError(403, "Unauthorized token");
            };

            // (verifiedToken as JwtPayload).role !== Role.ADMIN
            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(403, "Unauthorized access");
            };

            next();
        } catch (error) {
            next(error);
        }
};

export default checkAuth;