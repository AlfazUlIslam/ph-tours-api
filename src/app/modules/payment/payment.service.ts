import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInitService } from "../sslCommerz/sslCommerz.service";

export const initPaymentService = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
        throw new AppError(404, "Payment not found. You have not booked this tour.");
    };

    const booking = await Booking.findById(payment.booking);

    // Initiate SSLCommerz payment
    const userAddress = (booking?.user as any).address;
    const userEmail = (booking?.user as any).email;
    const userPhoneNumber = (booking?.user as any).phone;
    const userName = (booking?.user as any).name;

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };

    const sslPayment = await sslPaymentInitService(sslPayload);

    return {
        paymentUrl: sslPayment.GatewayPageURL
    };
};

export const successPaymentService = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PaymentStatus.PAID },
            { runValidators: true, session }
        );

        // Update booking status
        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BookingStatus.COMPLETE },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: "Payment completed successfully"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };
};

export const failPaymentService = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PaymentStatus.FAILED },
            { runValidators: true, session }
        );

        // Update booking status
        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BookingStatus.FAILED },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return {
            success: false,
            message: "Payment failed"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };
};

export const cancelPaymentService = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PaymentStatus.CANCELLED },
            { runValidators: true, session }
        );

        // Update booking status
        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BookingStatus.CANCEL },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return {
            success: false,
            message: "Payment canceled"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };
};