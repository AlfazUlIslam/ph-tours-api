import { Router, Request, Response, NextFunction } from "express";
import { credentialsLogin, getNewAccessToken, logout, resetPassword, googleRedirect } from "./auth.controller";
import { checkAuth } from "../../middlewares";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", credentialsLogin);
router.post("/refresh-token", getNewAccessToken);
router.post("/logout", logout);
router.post("/reset-password", checkAuth(...Object.values(Role)), resetPassword);
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })(req, res, next)
});
router.get(
    "/google/callback", 
    passport.authenticate("google", {failureRedirect: "/login"}), 
    googleRedirect
);

export default router;