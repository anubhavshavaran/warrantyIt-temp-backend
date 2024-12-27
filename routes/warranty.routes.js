import {Router} from "express";
import {
    handleCreateWarranty, handleDeleteWarranty,
    handleGetAllWarranties,
    handleGetWarranty,
    handleUpdateWarranty
} from "../controllers/warranty.controllers.js";

const router = Router();

router.route("/")
    .get(handleGetAllWarranties)
    .post(handleCreateWarranty);

router.route("/:id")
    .get(handleGetWarranty)
    .patch(handleUpdateWarranty)
    .delete(handleDeleteWarranty);

export default router;