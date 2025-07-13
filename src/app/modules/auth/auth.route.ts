import { Router } from "express";
import { credentialsLogin, getNewAccessToken } from "./auth.controller";

const router = Router();

router.post("/login", credentialsLogin);
router.post("/refresh-token", getNewAccessToken);

export default router;