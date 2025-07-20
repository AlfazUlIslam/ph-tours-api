import { Router } from "express";
import { checkAuth, validateRequest } from "../../middlewares";
import { Role } from "../user/user.interface";
import { createBooking, getUserBookings, getSingleBooking, getAllBookings, updateBookingStatus } from "./booking.controller";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";

const router = Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    createBooking
);

router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    getAllBookings
);

router.get(
    "/my-bookings",
    checkAuth(...Object.values(Role)),
    getUserBookings
);

router.get(
    "/:bookingId",
    checkAuth(...Object.values(Role)),
    getSingleBooking
);

router.patch(
    "/:bookingId/status",
    checkAuth(...Object.values(Role)),
    validateRequest(updateBookingStatusZodSchema),
    updateBookingStatus
);

export default router;