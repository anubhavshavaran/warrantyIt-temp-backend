import {Router} from "express";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";
import {createLog, getAllLogs} from "../controllers/log.controller.js";

const router = Router();

router.route('/')
        .get(getAllLogs)
        .post(isUserAuthenticated, createLog);

export default router;