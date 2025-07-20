import { Schema, model } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.UNPAID
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed
    },
    invoiceUrl: {
        type: String
    }
}, {
    timestamps: true
});

export const Payment = model<IPayment>("Payment", paymentSchema);