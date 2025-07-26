import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { sendOtpService } from "./otp.service";

export const sendOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, name } = req.body;
        await sendOtpService(email, name);

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