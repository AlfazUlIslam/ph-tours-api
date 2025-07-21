import AppError from "../../errorHelpers/AppError";
import { PaymentStatus } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const createBookingService = async (payload: Partial<IBooking>, userId: string) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        // Check if tour cost exists
        const tour = await Tour.findById(payload.tour).select("costFrom").session(session);
        if (!tour?.costFrom) {
            throw new AppError(400, "No tour cost found");
        };
    
        // Check if user provided phone or address
        const user = await User.findById(userId).session(session);
        if (!user?.phone || !user?.address) {
            throw new AppError(400, "Please add phone number or address");
        };
    
        // Create booking
        const booking = await Booking.create([{
            user: userId,
            status: BookingStatus.PENDING,
            ...payload
        }], {session});
    
        // Generate transactionId, calculate amount and create payment
        const transactionId = getTransactionId();
        const amount = tour.costFrom * payload.guestCount!;
        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PaymentStatus.UNPAID,
            transactionId,
            amount
        }], {session});
    
        // Update booking by adding payment id
        const updatedBooking = await Booking.findByIdAndUpdate(
            booking[0]._id,
            { payment: payment[0]._id },
            { new: true, runValidators: true, session }
        )
        .populate("user", "name email phone address")
        .populate("tour", "title costFrom")
        .populate("payment");

        await session.commitTransaction();
        session.endSession();

        return updatedBooking;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
export const getUserBookingsService = async () => {
    return {};
};
export const getBookingByIdService = async () => {
    return {};
};
export const updateBookingStatusService = async () => {
    return {};
};
export const getAllBookingsService = async () => {
    return {};
};