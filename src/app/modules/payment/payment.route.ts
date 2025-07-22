import { Router } from "express";
import { successPayment, failPayment, cancelPayment, initPayment } from "./payment.controller";

const router = Router();

router.post("/init-payment/:bookingId", initPayment);
router.post("/success", successPayment);
router.post("/fail", failPayment);
router.post("/cancel", cancelPayment);

export default router;