import {Router} from "express";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";
import multer from "multer";
import {handleText} from "../controllers/ocr.controllers.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5000000 }
});

router.post('/', isUserAuthenticated, upload.single('image'), handleText);

export default router;