import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";

export const sendOtp = asyncHandler(
    async (req: Request, res: Response) => {
        
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "OTP sent successfully",
            data: null
        });
    }
);

export const verifyOtp = asyncHandler(
    async (req: Request, res: Response) => {

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "OTP verified successfully",
            data: null
        });
    }
);