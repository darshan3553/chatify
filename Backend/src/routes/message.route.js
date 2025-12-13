import { Router } from 'express';
import { getAllContacts, getMessagesByUserId, sendMessage, getChatpartners } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';
const router = Router();

router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);

router.get("/chats", getChatpartners);

router.get("/:id", getMessagesByUserId);

router.post("/send/:id", sendMessage);

export default router;