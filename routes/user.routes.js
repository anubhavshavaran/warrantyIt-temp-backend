import {Router} from "express";
import {handleGetUser, handleUpdateUser} from "../controllers/user.controller.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.route("/")
    .get(isUserAuthenticated, handleGetUser)
    .patch(isUserAuthenticated, handleUpdateUser);

export default router;