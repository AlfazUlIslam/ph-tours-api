import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from "../../utils";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import { IAuthProvider } from "../user/user.interface";

// import { IUser } from "../user/user.interface";
// genUserTokens
// export const credentialsLoginService = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;

//     const isValUser = await User.findOne({ email });

//     if (!isValUser) {
//         throw new AppError(404, "User with provided email does not exist");
//     };

//     const isValPassword = await bcryptjs.compare(
//         password as string, 
//         isValUser.password as string
//     );

//     if (!isValPassword) {
//         throw new AppError(404, "Incorrect password");
//     };

//     const userTokens = genUserTokens(isValUser);

//     const { password: pass, ...user } = isValUser.toObject();

//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user
//     };
// };

export const getNewAccessTokenService = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return { accessToken: newAccessToken };
};

export const changePasswordService = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string);
    if (!isOldPasswordMatch) {
        throw new AppError(403, "Old password doesn't match");
    };

    user!.password = await bcryptjs.hash(newPassword, Number(env.BCRYPT_SALT_ROUND));
    user!.save();
};

export const resetPasswordService = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string);
    if (!isOldPasswordMatch) {
        throw new AppError(403, "Old password doesn't match");
    };

    user!.password = await bcryptjs.hash(newPassword, Number(env.BCRYPT_SALT_ROUND));
    user!.save();
};

export const setPasswordService = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    };

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(400, "You have already set the password. Now you can change the password from your profile password update");
    };

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(env.BCRYPT_SALT_ROUND)
    );

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    };

    const auths: IAuthProvider[] = [...user.auths, credentialProvider];

    user.password = hashedPassword;
    user.auths = auths;

    await user.save();
};