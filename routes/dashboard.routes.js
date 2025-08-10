import {Router} from "express";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";
import {handleUserDashboard} from "../controllers/dashboard.controllers.js";

const router = Router();

router.get('/', isUserAuthenticated, handleUserDashboard)

export default router;