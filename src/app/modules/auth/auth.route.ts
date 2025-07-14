import { Router } from "express";
import { credentialsLogin, getNewAccessToken, logout } from "./auth.controller";

const router = Router();

router.post("/login", credentialsLogin);
router.post("/refresh-token", getNewAccessToken);
router.post("/logout", logout);

export default router;