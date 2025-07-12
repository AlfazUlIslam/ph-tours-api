import { Router } from "express";
import { credentialsLogin } from "./auth.controller";

const router = Router();

router.post("/login", credentialsLogin);

export default router;