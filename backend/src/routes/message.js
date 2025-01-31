import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messagef.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;