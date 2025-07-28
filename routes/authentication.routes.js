import {Router} from "express";
import {
    handleUserSignUp,
    handleUserSignIn,
    handleUserWithGoogle,
    handleVerifyUser, handleSendOTP, handleUserExists, handleForgotPassword
} from "../controllers/authentication.controllers.js";
import passport from "passport";

const router = Router();

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

router.get(
    '/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/'}),
    handleUserWithGoogle
);

router.post("/signup", handleUserSignUp);
router.post("/signin", handleUserSignIn);
router.post("/verify", handleVerifyUser);
router.post("/userexists", handleUserExists);
router.post("/otp", handleSendOTP);
router.post("/forgotpassword", handleForgotPassword);

export default router;