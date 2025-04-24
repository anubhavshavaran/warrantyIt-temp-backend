import {Router} from "express";
import {handleCreateBrand, handleGetAllBrandsByCatSubCat} from "../controllers/brand.controllers.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.route('/').post(isUserAuthenticated, handleCreateBrand);

router.route('/:cat/:subcat').get(isUserAuthenticated, handleGetAllBrandsByCatSubCat);

export default router;