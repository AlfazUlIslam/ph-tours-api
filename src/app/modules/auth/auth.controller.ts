import type { Request, Response, NextFunction } from "express";
import { asyncHandler, sendResponse, setAuthCookie } from "../../utils";
import { credentialsLoginService, getNewAccessTokenService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

export const credentialsLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await credentialsLoginService(req.body);

    setAuthCookie(res, loginInfo);
    
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

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "New access token retrieved",
        data: tokenInfo
    });
    return;
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie(
        "accessToken",
        { httpOnly: true, secure: false, sameSite: "lax", path: '/' }
    );
    
    res.clearCookie(
        "refreshToken",
        { httpOnly: true, secure: false, sameSite: "lax", path: '/' }
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged out successfully",
        data: null
    });
    return;
});