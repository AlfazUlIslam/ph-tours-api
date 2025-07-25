import type { Request, Response, NextFunction } from "express";
import { asyncHandler, genUserTokens, sendResponse, setAuthCookie } from "../../utils";
// credentialsLoginService
import { getNewAccessTokenService, resetPasswordService, setPasswordService, changePasswordService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import passport from "passport";

export const credentialsLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
        if (error) {
            return next(new AppError(401, error));
        };

        if (!user) {
            return next(new AppError(401, info.message));
        };

        // Generate tokens and set cookies
        const userTokens = await genUserTokens(user);
        setAuthCookie(res, userTokens);

        // Remove password field and send response
        const { passport: pass, ...rest } = user.toObject();
        
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
        return;
    })(req, res, next);
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

export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await changePasswordService(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password reset successfully",
        data: null
    });
    return;
});

export const setPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await setPasswordService(decodedToken.userId, password);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password reset successfully",
        data: null
    });
    return;
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await resetPasswordService(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password reset successfully",
        data: null
    });
    return;
});

export const googleRedirect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : "";

    if (redirectTo.startsWith("/")) {
       redirectTo = redirectTo.slice(1); 
    };

    const user = req.user;

    if (!user) {
        throw new AppError(404, "User not found");
    };

    const tokenInfo = genUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${env.FRONTEND_URL}/${redirectTo}`);
});