import type { Request, Response, NextFunction } from "express";
import { createUserService, getUsersService } from "./user.service";
import { asyncHandler } from "../../utils";

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await createUserService(req.body);

    res.status(201).json({
        success: true,
        message: "User created",
        data: user
    });
    return;
});

export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await getUsersService();

    res.status(200).json({
        success: true,
        message: "All users",
        data: users
    });
    return;
});

