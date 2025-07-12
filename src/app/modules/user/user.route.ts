import { Router } from "express";
import { createUser, getUsers, updateUser } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), createUser);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getUsers);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), updateUser);

export default router;