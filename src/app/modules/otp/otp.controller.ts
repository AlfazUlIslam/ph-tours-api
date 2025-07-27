import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { sendOtpService, verifyOtpService } from "./otp.service";

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
        const { email , otp } = req.body;
        await verifyOtpService(email, otp);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "OTP verified successfully",
            data: null
        });
    }
);