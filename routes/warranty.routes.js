import {Router} from "express";
import {
    handleCreateWarranty, handleDeleteWarranty,
    handleGetAllWarranties,
    handleGetWarranty,
    handleUpdateWarranty
} from "../controllers/warranty.controllers.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.route("/")
    .get(isUserAuthenticated, handleGetAllWarranties)
    .post(isUserAuthenticated, handleCreateWarranty);

router.route("/:id")
    .get(isUserAuthenticated, handleGetWarranty)
    .patch(isUserAuthenticated, handleUpdateWarranty)
    .delete(isUserAuthenticated, handleDeleteWarranty);

export default router;