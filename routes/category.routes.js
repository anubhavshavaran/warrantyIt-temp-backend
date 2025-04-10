import {Router} from "express";
import {getAllCategories, getAllSubCategories} from "../controllers/category.controllers.js";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";

const router = Router();

router.get('/:cat', isUserAuthenticated, getAllSubCategories);
router.get('/', isUserAuthenticated, getAllCategories);

export default router;