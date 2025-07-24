import { Router } from "express";
import { createDivision, getAllDivisions, getSingleDivision, updateDivision, deleteDivision } from "./division.controller";
import { Role } from "../user/user.interface";
import { checkAuth, validateRequest } from "../../middlewares";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
    "/create", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(createDivisionSchema),
    createDivision
);
router.get("/", getAllDivisions);
router.get("/:slug", getSingleDivision)
router.patch(
    "/:id", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    updateDivision
);
router.delete(
    "/:id", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    deleteDivision
);

export default router;