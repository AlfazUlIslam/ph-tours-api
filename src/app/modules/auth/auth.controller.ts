import type { Request, Response, NextFunction } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { credentialsLoginService } from "./auth.service";

export const credentialsLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await credentialsLoginService(req.body);
    
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: loginInfo
    });
    return;
});