import {Router} from "express";
import {
    handleDeleteProduct,
    handleGetAllProducts,
    handleGetProduct, handleGetProductsByBrand, handleGetProductsByCatSubCat,
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

router.route("/search/:q")
    .get(isUserAuthenticated, handleSearchProducts);

router.route("/brand/:brand")
        .get(isUserAuthenticated, handleGetProductsByBrand)

router.route("/:cat/:subCat")
    .get(isUserAuthenticated, handleGetProductsByCatSubCat)

export default router;