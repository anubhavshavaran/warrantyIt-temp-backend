import {Router} from "express";
import {handleGetAllBrandsByCatSubCat} from "../controllers/brand.controllers.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.route('/:cat/:subcat').get(isUserAuthenticated, handleGetAllBrandsByCatSubCat);

export default router;