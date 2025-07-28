import { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../utils";
import { getInvoiceDownloadUrlService, cancelPaymentService, failPaymentService, initPaymentService, successPaymentService } from "./payment.service";
import { env } from "../../config/env";
import { validatePaymentService } from "../sslCommerz/sslCommerz.service";

export const initPayment = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;

    const result = await initPaymentService(bookingId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result
    });
});

export const successPayment = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await successPaymentService(query as Record<string, string>);

    if (result.success) {
        res.redirect(`${env.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});

export const failPayment = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await failPaymentService(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${env.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});

export const cancelPayment = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await cancelPaymentService(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${env.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});

export const getInvoiceDownloadUrl = asyncHandler(
    async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        const result = await getInvoiceDownloadUrlService(paymentId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Invoice download URL retrieved successfully",
            data: result
        });
    }
);

export const validatePayment = asyncHandler(
    async (req: Request, res: Response) => {
        console.log("sslcommerz ipn url body", req.body);
        await validatePaymentService(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null
        });
    }
);