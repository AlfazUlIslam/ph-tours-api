import { User } from "../modules/user/user.model";
import { env } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs";

const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({email: env.SUPER_ADMIN_EMAIL});

        if (isSuperAdminExist) {
            console.log("Super admin already exists");
            return;
        }

        const hashedPassword = await bcryptjs.hash(
            env.SUPER_ADMIN_PASSWORD,
            Number(env.BCRYPT_SALT_ROUND)
        );

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: env.SUPER_ADMIN_EMAIL
        };

        const payload: IUser = {
            name: "Super admin",
            role: Role.SUPER_ADMIN,
            email: env.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        };

        const superAdmin = await User.create(payload);
        console.log("Super admin created successfully \n");
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
};

export default seedSuperAdmin;