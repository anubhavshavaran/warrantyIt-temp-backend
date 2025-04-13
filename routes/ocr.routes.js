import {Router} from "express";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";
import multer from "multer";
import {handleAI} from "../controllers/ocr.controllers.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5000000 }
});

router.post('/ai', isUserAuthenticated, upload.single('image'), handleAI);

export default router;