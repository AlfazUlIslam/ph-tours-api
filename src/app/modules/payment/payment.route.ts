import { Router } from "express";
import { getInvoiceDownloadUrl, successPayment, failPayment, cancelPayment, initPayment } from "./payment.controller";
import { checkAuth } from "../../middlewares";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/init-payment/:bookingId", initPayment);
router.post("/success", successPayment);
router.post("/fail", failPayment);
router.post("/cancel", cancelPayment);
router.get(
    "/invoice/:paymentId", 
    checkAuth(...Object.values(Role)), 
    getInvoiceDownloadUrl
);
// router.post("/validate-payment", validatePayment);

export default router;