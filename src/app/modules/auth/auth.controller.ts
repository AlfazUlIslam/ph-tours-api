import type { Request, Response, NextFunction } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { credentialsLoginService, getNewAccessTokenService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

export const credentialsLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await credentialsLoginService(req.body);

    res.cookie(
        "accessToken",
        loginInfo.accessToken,
        { httpOnly: true, secure: false }
    );
    
    res.cookie(
        "refreshToken",
        loginInfo.refreshToken,
        { httpOnly: true, secure: false }
    );
    
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: loginInfo
    });
    return;
});

export const getNewAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(404, "No refresh token recieved from cookies");
    };

    const tokenInfo = await getNewAccessTokenService(refreshToken);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: tokenInfo
    });
    return;
});