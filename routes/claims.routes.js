import {Router} from "express";
import {isUserAuthenticated} from "../middlewares/Authentication.middleware.js";
import {
    handleCreateClaim, handleDeleteClaim,
    handleGetAllClaims,
    handleGetClaimById,
    handleUpdateClaim,
    handleUpdateClaimStatus
} from "../controllers/claims.controller.js";

const router = Router();

router.get('/', isUserAuthenticated, handleGetAllClaims);
router.get('/:id', isUserAuthenticated, handleGetClaimById);
router.post('/', isUserAuthenticated, handleCreateClaim);
router.put('/', isUserAuthenticated, handleUpdateClaim);
router.put('/status/:id', isUserAuthenticated, handleUpdateClaimStatus);
router.delete('/', isUserAuthenticated, handleDeleteClaim);

export default router;