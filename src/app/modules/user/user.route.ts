import { Router } from "express";
import { createUser, getUsers, updateUser, getMe, getSingleUser } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), createUser);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getUsers);
router.get("/me", checkAuth(...Object.values(Role)), getMe);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getSingleUser);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), updateUser);

export default router;