import { ISSLCommerz } from "./sslCommerz.interface";
import { env } from "../../config/env";
import axios from "axios";
import AppError from "../../errorHelpers/AppError";

export const sslPaymentInitService = async (payload: ISSLCommerz) => {
    try {
        const data = {
            store_id: env.SSL.SSL_STORE_ID,
            store_passwd: env.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${env.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${env.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${env.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            shipping_method: "NO",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A"
        };

        const response = await axios({
            method: "POST",
            url: env.SSL.SSL_PAYMENT_API,
            data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        
        return response.data;
    } catch (error: any) {
        console.log("Payment error occurred", error);
        throw new AppError(400, error.message)
    }
};