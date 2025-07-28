import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { getBookingStatsService, getPaymentStatsService, getUserStatsService, getTourStatsService } from "./stats.service";

export const getBookingStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await getBookingStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking stats fetched successfully",
        data: stats,
    });
});

export const getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await getPaymentStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment stats fetched successfully",
        data: stats,
    });
});

export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await getUserStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

export const getTourStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await getTourStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: stats,
    });
});