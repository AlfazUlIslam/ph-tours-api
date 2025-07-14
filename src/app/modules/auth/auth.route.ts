import { Router } from "express";
import { credentialsLogin, getNewAccessToken, logout, resetPassword } from "./auth.controller";
import { checkAuth } from "../../middlewares";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", credentialsLogin);
router.post("/refresh-token", getNewAccessToken);
router.post("/logout", logout);
router.post("/reset-password", checkAuth(...Object.values(Role)), resetPassword);

export default router;