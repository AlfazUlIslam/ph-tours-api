import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IUser, IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import { genUserTokens, verifyToken, genToken } from "../../utils";
import { env } from "../../config/env";

export const credentialsLoginService = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isValUser = await User.findOne({ email });

    if (!isValUser) {
        throw new AppError(404, "User with provided email does not exist");
    };

    const isValPassword = await bcryptjs.compare(
        password as string, 
        isValUser.password as string
    );

    if (!isValPassword) {
        throw new AppError(404, "Incorrect password");
    };

    const userTokens = genUserTokens(isValUser);

    const { password: pass, ...user } = isValUser.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user
    };
};

export const getNewAccessTokenService = async (refreshToken: string) => {
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

    return { accessToken };
};