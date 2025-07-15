import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";
import { env } from "../config/env";

const genUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    
    const accessToken = generateToken(jwtPayload, env.JWT_SECRET, env.JWT_EXPIRY);
    const refreshToken = generateToken(jwtPayload, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRY);

    return { accessToken, refreshToken };
};

export default genUserTokens;