import { Router } from "express";
import { createUser, getUsers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), createUser);
router.get("/", getUsers);

export default router;