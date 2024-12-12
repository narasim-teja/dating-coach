import express from 'express';
import { ChatbotController } from '../controllers/chatbot.controller';

const router = express.Router();

// POST /api/chatbot/chat - Send a message to the chatbot
router.post('/chat', ChatbotController.chat);

// POST /api/chatbot/clear - Clear conversation history
router.post('/clear', ChatbotController.clearHistory);

export default router; 