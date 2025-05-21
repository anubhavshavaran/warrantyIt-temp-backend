import {Router} from "express";
import {
    handleUserSignUp,
    handleUserSignIn,
    handleUserWithGoogle,
    handleVerifyUser, handleSendOTP
} from "../controllers/authentication.controllers.js";
import passport from "passport";

const router = Router();

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback',
        passport.authenticate('google', {session: false, failureRedirect: '/'}),
        (req, res) => {
            // Generate JWT
            console.log('done with everything')
            console.log('Request', req);
            console.log('User', req.user);
            // const token = jwt.sign({
            //     id: req.user.id,
            //     name: req.user.displayName,
            //     email: req.user.emails[0].value
            // }, process.env.JWT_SECRET, { expiresIn: '1h' });
            //
            // // Redirect to React Native deep link
            res.status(200).send({
                user: req.user,
            });
        }
);

router.post("/signup", handleUserSignUp);
router.post("/verify", handleVerifyUser);
router.post("/signin", handleUserSignIn);
router.post("/google/:token", handleUserWithGoogle);
router.post("/otp", handleSendOTP);

export default router;