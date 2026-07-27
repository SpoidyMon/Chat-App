import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar } from "../controllers/message.controller.js";
import message from "../models/message.model.js";
import express from "express"

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post("/send/:id",protectRoute,)


export default router;