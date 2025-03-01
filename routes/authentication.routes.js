import { Router } from "express";
import {
    handleUserSignUp,
    handleUserSignIn,
    handleUserWithGoogle,
    handleVerifyUser, handleSendOTP
} from "../controllers/authentication.controllers.js";

const router = Router() ;

router.post("/signup", handleUserSignUp);
router.post("/verify", handleVerifyUser);
router.post("/signin", handleUserSignIn);
router.post("/google/:token", handleUserWithGoogle);
router.post("/otp", handleSendOTP);

export default router;