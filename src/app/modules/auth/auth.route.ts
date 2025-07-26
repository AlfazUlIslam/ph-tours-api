import { Router, Request, Response, NextFunction } from "express";
import { forgotPassword, credentialsLogin, getNewAccessToken, logout, changePassword, resetPassword, googleRedirect, setPassword } from "./auth.controller";
import { checkAuth } from "../../middlewares";
import { Role } from "../user/user.interface";
import passport from "passport";
import { env } from "../../config/env";

const router = Router();

router.post("/login", credentialsLogin);
router.post("/refresh-token", getNewAccessToken);
router.post("/logout", logout);
router.post("/change-password", checkAuth(...Object.values(Role)), changePassword);
router.post("/set-password", checkAuth(...Object.values(Role)), setPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", checkAuth(...Object.values(Role)), resetPassword);
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
        state: redirect as string
    })(req, res, next)
});
router.get(
    "/google/callback", 
    passport.authenticate(
        "google", 
        {failureRedirect: `${env.FRONTEND_URL}/login?error=There are some issues with your account. Please contact with our support team.`}
    ), 
    googleRedirect
);

export default router;