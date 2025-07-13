import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { genUserTokens, createNewAccessTokenWithRefreshToken } from "../../utils";

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
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return { accessToken: newAccessToken };
};