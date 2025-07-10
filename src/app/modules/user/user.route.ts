import { Router } from "express";
import { createUser, getUsers } from "./user.controller";

const router = Router();

router.post("/register", createUser);
router.get("/", getUsers);

export default router;