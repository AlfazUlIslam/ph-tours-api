import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken, sendEmail } from "../../utils";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken";

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

export const resetPasswordService = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id !== decodedToken.userId) {
        throw new AppError(401, "You cannot reset your password");
    };

    const isUserExist = await User.findById(decodedToken.userId);

    if (!isUserExist) {
        throw new AppError(401, "User does not exist");
    };

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(env.BCRYPT_SALT_ROUND)
    );

    isUserExist.password = hashedPassword;

    await isUserExist.save();
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

export const forgotPasswordService = async (email: string) => {
    const isUserExist = await User.findOne({email});

    if (!isUserExist) {
        throw new AppError(400, "User does not exist");
    };

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${isUserExist.isActive}`);
    };
    
    if (isUserExist.isDeleted) {
        throw new AppError(400, "User is deleted");
    };
    
    if (isUserExist.isVerified) {
        throw new AppError(400, "User is not verified");
    };

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };

    const resetToken = jwt.sign(
        jwtPayload, env.JWT_SECRET, {expiresIn: "10m"}
    );

    const resetUILink = `${env.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgotPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        } 
    });
};