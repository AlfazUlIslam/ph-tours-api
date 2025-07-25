import { Router } from "express";
import { checkAuth, validateRequest } from "../../middlewares";
import { Role } from "../user/user.interface";
import { createTourZodSchema, updateTourZodSchema, createTourTypeZodSchema } from "./tour.validation";
import { createTourType, updateTourType, getAllTourTypes, deleteTourType, getAllTours, createTour, updateTour, deleteTour } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
router.get("/tour-types", getAllTourTypes);

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    createTourType
);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    updateTourType
);

router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), deleteTourType);

/* --------------------- TOUR ROUTES ---------------------- */
router.get("/", getAllTours);

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(createTourZodSchema),
    createTour
);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(updateTourZodSchema),
    updateTour
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), deleteTour);

export default router;