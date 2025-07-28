import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

const checkAuth = (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                throw new AppError(403, "No token recieved");
            };

            const verifiedToken = verifyToken(accessToken, env.JWT_SECRET) as JwtPayload;

            if (!verifiedToken) {
                throw new AppError(403, "Unauthorized token");
            };

            const isValUser = await User.findOne({email: verifiedToken.email});

            if (!isValUser) {
                throw new AppError(400, "User does not exist");
            };

            if (isValUser.isActive === IsActive.BLOCKED || isValUser.isActive === IsActive.INACTIVE) {
                throw new AppError(400, `User is ${isValUser.isActive}`);
            };
            
            if (isValUser.isDeleted) {
                throw new AppError(400, "User is deleted");
            };
            
            if (!isValUser.isVerified) {
                throw new AppError(400, "User is not verified");
            };

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(403, "Unauthorized access");
            };

            req.user = verifiedToken;
            next();
        } catch (error) {
            next(error);
        }
};

export default checkAuth;