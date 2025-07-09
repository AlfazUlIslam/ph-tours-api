import type { Request, Response } from "express";
import { User } from "./user.model";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        const user = await User.create({
            name,
            email
        });

        res.status(201).json({
            success: true,
            message: "User created",
            user
        });
        return;
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: `Something went wrong ${error.message}`
            });
            return;
        };
    }
};