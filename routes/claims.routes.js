import {Router} from "express";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";
import {
    handleCreateClaim, handleDeleteClaim,
    handleGetAllClaims,
    handleGetClaimById,
    handleUpdateClaim
} from "../controllers/claims.controller.js";

const router = Router();

router.get('/', isUserAuthenticated, handleGetAllClaims);
router.get('/:id', isUserAuthenticated, handleGetClaimById);
router.post('/', isUserAuthenticated, handleCreateClaim);
router.put('/', isUserAuthenticated, handleUpdateClaim);
router.delete('/', isUserAuthenticated, handleDeleteClaim);

export default router;