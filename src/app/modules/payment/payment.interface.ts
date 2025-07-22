import { Types } from "mongoose"

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED"
};

export interface IPayment {
    booking: Types.ObjectId;
    amount: number;
    transactionId: string;
    paymentGatewayData?: any;
    invoiceUrl?: string;
    status: PaymentStatus
};