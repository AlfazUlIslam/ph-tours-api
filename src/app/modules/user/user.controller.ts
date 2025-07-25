import type { Request, Response, NextFunction } from "express";
import { getMeService, createUserService, getUsersService, updateUserService } from "./user.service";
import { asyncHandler, sendResponse } from "../../utils";
import { JwtPayload } from "jsonwebtoken";

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
        data: result.data
    });
    return;
});

export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, env.JWT_SECRET) as JwtPayload;
    const verifiedToken = req.user as JwtPayload;
    const payload = req.body;

    const user = await updateUserService(userId, payload, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "User updated successfully",
        data: user
    });
    return;
});

export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await getMeService(decodedToken.userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Your profile",
        data: result.data
    });
    return;
});