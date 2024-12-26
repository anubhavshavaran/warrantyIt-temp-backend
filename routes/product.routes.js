import { Router } from "express";
import { handleRegisterProduct } from "../controllers/product.controllers.js";

const router = Router() ;

router.post("/register",handleRegisterProduct) ;

export default router ;  //export the router to use it in other files  