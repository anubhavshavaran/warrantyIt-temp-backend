import {Router} from "express";
import {
    handleDeleteProduct,
    handleGetAllProducts,
    handleGetProduct, handleGetProductsByType,
    handleRegisterProduct, handleSearchProducts,
    handleUpdateProduct
} from "../controllers/product.controllers.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.route("/")
    .get(isUserAuthenticated, handleGetAllProducts)
    .post(isUserAuthenticated, handleRegisterProduct)

router.route("/:id")
    .get(isUserAuthenticated, handleGetProduct)
    .patch(isUserAuthenticated, handleUpdateProduct)
    .delete(isUserAuthenticated, handleDeleteProduct);

router.route("/type/:type")
    .get(isUserAuthenticated, handleGetProductsByType);

router.route("/search/:q")
    .get(isUserAuthenticated, handleSearchProducts);

export default router;