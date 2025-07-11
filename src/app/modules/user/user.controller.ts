import type { Request, Response, NextFunction } from "express";
import { createUserService, getUsersService } from "./user.service";
import { asyncHandler, sendResponse } from "../../utils";

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await createUserService(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created",
        data: user
    });
    return;
});

export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getUsersService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All users",
        data: result.data,
        meta: result.meta
    });
    return;
});

