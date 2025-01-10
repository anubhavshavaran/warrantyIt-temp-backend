import {Router} from "express";
import {
    handleDeleteProduct,
    handleGetAllProducts,
    handleGetProduct,
    handleRegisterProduct,
    handleUpdateProduct
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/")
    .get(handleGetAllProducts)
    .post(handleRegisterProduct)

router.route("/:id")
    .get(handleGetProduct)
    .patch(handleUpdateProduct)
    .delete(handleDeleteProduct);

export default router;