import {Router} from "express";
import {
    handleCreateVendor,
    handleDeleteVendor,
    handleGetAllVendors,
    handleGetVendor,
    handleSearchVendors,
    handleUpdateVendor
} from "../controllers/vendor.controllers.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.route("/")
    .get(isUserAuthenticated, handleGetAllVendors)
    .post(isUserAuthenticated, handleCreateVendor);

router.route("/:id")
    .get(isUserAuthenticated, handleGetVendor)
    .patch(isUserAuthenticated, handleUpdateVendor)
    .delete(isUserAuthenticated, handleDeleteVendor);

router.route("/search/:q")
    .get(isUserAuthenticated, handleSearchVendors);

export default router;