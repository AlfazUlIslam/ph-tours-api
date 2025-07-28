import express from "express";
import { checkAuth } from "../../middlewares";
import { Role } from "../user/user.interface";
import { getBookingStats, getPaymentStats, getUserStats, getTourStats } from "./stats.controller";

const router = express.Router();

router.get(
    "/booking",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    getBookingStats
);
router.get(
    "/payment",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    getPaymentStats
);
router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    getUserStats
);
router.get(
    "/tour",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    getTourStats
);

export default router;