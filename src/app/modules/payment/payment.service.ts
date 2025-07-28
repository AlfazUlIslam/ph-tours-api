import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInitService } from "../sslCommerz/sslCommerz.service";
import generatePdf, { IInvoiceData } from "../../utils/invoice";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { sendEmail } from "../../utils";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";

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

        if (!updatedPayment) {
            throw new AppError(401, "Payment not found");
        };

        // Update booking status
        const updatedBooking = await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BookingStatus.COMPLETE },
            { new: true, runValidators: true, session }
        )
        .populate("tour", "title")
        .populate("user", "name email");

        if (!updatedBooking) {
            throw new AppError(401, "Booking not found");
        };

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking?.createdAt as Date,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            tourTitle: (updatedBooking.tour as unknown as ITour).title,
            transactionId: updatedPayment.transactionId,
            userName: (updatedBooking.user as unknown as IUser).name
        };

        const pdfBuffer = await generatePdf(invoiceData);

        const cloudinaryResult = await uploadBufferToCloudinary(
            pdfBuffer,
            "invoice"
        );

        if (!cloudinaryResult) {
            throw new AppError(401, "Error uploading pdf");
        };

        await Payment.findByIdAndUpdate(
            updatedPayment._id,
            { invoiceUrl: cloudinaryResult?.secure_url },
            { runValidators: true, session }
        );

        console.log(cloudinaryResult);

        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });

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

export const getInvoiceDownloadUrlService = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};