import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { env } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

export const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const userExists = await User.findOne({email});

    if (userExists) {
        throw new AppError(404, "User already exists with the provided email");
    };

    const hashedPassword = await bcryptjs.hash(
        password as string, 
        Number(env.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    return user;
};

export const getUsersService = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
};

export const updateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isValUser = await User.findById(userId);

    if (!isValUser) {
        throw new AppError(404, "User not found");
    };

    if (isValUser.isDeleted || isValUser.isActive === IsActive.BLOCKED) {
        throw new AppError(403, "This user cannot be updated");
    };
    
    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(403, "You are not authorized");          
        };

        if (payload.role == Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(403, "You are not authorized");
        };
    };

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(403, "You are not authorized");
        };
    };

    if (payload.password) {
        payload.password = await bcryptjs.hash(
            payload.password,
            env.BCRYPT_SALT_ROUND
        );
    };

    const newUpdatedUser = await User.findByIdAndUpdate(
        userId,
        payload,
        {new: true, runValidators: true}
    );

    return newUpdatedUser;
};

export const getMeService = async (userId: string) => {
    const user = await User.findById(userId).select("-password");

    return {
        data: user
    };
};