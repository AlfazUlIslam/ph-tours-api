import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";

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

    return {
        email: isValUser.email
    };
};