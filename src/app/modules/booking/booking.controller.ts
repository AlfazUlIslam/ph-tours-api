import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { createBookingService, getUserBookingsService, getBookingByIdService, getAllBookingsService, updateBookingStatusService } from "./booking.service";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await createBookingService();
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking
    });
});

export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
    const bookings = await getUserBookingsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings
    });
});

export const getSingleBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await getBookingByIdService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: booking
    });
});

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const bookings = await getAllBookingsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: {}
    });
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
    const updated = await updateBookingStatusService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking status updated successfully",
        data: updated
    });
});