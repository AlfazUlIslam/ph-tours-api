import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

export const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const userExists = await User.findOne({email});

    if (userExists) {
        throw new AppError(404, "User already exists");
    };

    const hashedPassword = await bcryptjs.hash(password as string, 10);

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