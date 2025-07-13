import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import verifyToken from "./verifyToken";
import genToken from "./genToken";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";

const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

    const isValUser = await User.findOne({email: verifiedRefreshToken.email});

    if (!isValUser) {
        throw new AppError(404, "User does not exist");
    };

    if (isValUser.isActive === IsActive.BLOCKED || isValUser.isActive === IsActive.INACTIVE) {
        throw new AppError(404, `User is ${isValUser.isActive}`);
    };
    
    if (isValUser.isDeleted) {
        throw new AppError(404, "User is deleted");
    };

    const jwtPayload = {
        userId: isValUser._id,
        email: isValUser.email,
        role: isValUser.role
    };

    const accessToken = genToken(jwtPayload, env.JWT_SECRET, env.JWT_EXPIRY);

    return accessToken;
};

export default createNewAccessTokenWithRefreshToken;