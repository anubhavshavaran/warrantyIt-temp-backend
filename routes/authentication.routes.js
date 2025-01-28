import { Router } from "express";
import {
    handleUserSignUp,
    handleUserSignIn,
    handleUserWithGoogle,
    handleVerifyUser
} from "../controllers/authentication.controllers.js";

const router = Router() ;

router.post("/signup", handleUserSignUp);
router.post("/verify", handleVerifyUser);
router.post("/signin", handleUserSignIn);
router.post("/google/:token", handleUserWithGoogle);

export default router;