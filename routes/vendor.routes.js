import {Router} from "express";
import {
    handleCreateVendor, handleDeleteVendor,
    handleGetAllVendors,
    handleGetVendor,
    handleUpdateVendor
} from "../controllers/vendor.controllers.js";

const router = Router();

router.route("/")
    .get(handleGetAllVendors)
    .post(handleCreateVendor);

router.route("/:id")
    .get(handleGetVendor)
    .patch(handleUpdateVendor)
    .delete(handleDeleteVendor);

export default router;