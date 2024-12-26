
import { Router } from "express";
import { handleUserSignUp, handleUserSignIn } from "../controllers/authentication.controllers.js";

const router = Router() ;

router.post("/signup",handleUserSignUp) ;
router.post("/signin",handleUserSignIn) ;

export default router;