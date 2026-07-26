import express from "express";
import { signupController,loginController,logoutController,updateController,checkAuth } from "../controllers/auth.contoller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router=express.Router();

router.post('/signup',signupController);
router.post('/login',loginController);
router.post('/logout',logoutController);
router.put('/updateprofile',protectRoute,updateController);
router.get("/check",protectRoute,checkAuth)

export default router;