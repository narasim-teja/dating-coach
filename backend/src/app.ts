import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conversationRoutes from './routes/conversation.routes';
import messageRoutes from './routes/message.routes';
import chatbotRoutes from './routes/chatbot.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatbot', chatbotRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app; 