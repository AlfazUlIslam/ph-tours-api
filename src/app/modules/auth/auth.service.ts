import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
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

    const jwtPayload = {
        userId: isValUser._id,
        email: isValUser.email,
        role: isValUser.role
    };

    const accessToken = generateToken(
        jwtPayload,
        env.JWT_SECRET,
        env.JWT_EXPIRY
    );

    return {
        accessToken
    };
};