import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validateRequest';
import { ChatbotService, ConversationContext, Message } from '../services/ChatbotService';

const router = Router();
const chatbotService = new ChatbotService();

// Validation rules
const chatValidation = [
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .trim(),
    body('userId')
        .notEmpty()
        .withMessage('UserId is required')
        .isString()
        .withMessage('UserId must be a string')
        .trim(),
    body('context')
        .optional()
        .isObject()
        .withMessage('Context must be an object'),
    body('context.goal')
        .optional()
        .isIn(['GET_PHONE_NUMBER', 'SET_DATE', 'ASK_OUT', 'BUILD_RAPPORT'])
        .withMessage('Invalid conversation goal'),
    body('context.matchInfo')
        .optional()
        .isObject()
        .withMessage('Match info must be an object'),
    body('context.matchInfo.platform')
        .optional()
        .isString()
        .withMessage('Platform must be a string'),
    body('context.matchInfo.userGender')
        .optional()
        .isString()
        .withMessage('User gender must be a string'),
    body('context.matchInfo.matchGender')
        .optional()
        .isString()
        .withMessage('Match gender must be a string'),
    body('context.matchInfo.conversationStage')
        .optional()
        .isIn(['initial', 'building_rapport', 'advancing', 'closing'])
        .withMessage('Invalid conversation stage'),
    body('context.messages')
        .optional()
        .isArray()
        .withMessage('Messages must be an array'),
    body('context.messages.*.role')
        .optional()
        .isIn(['user', 'assistant'])
        .withMessage('Message role must be either user or assistant'),
    body('context.messages.*.content')
        .optional()
        .isString()
        .withMessage('Message content must be a string'),
    body('context.messages.*.timestamp')
        .optional()
        .isISO8601()
        .withMessage('Message timestamp must be a valid date')
];

router.post(
    '/chat',
    validate(chatValidation),
    async (req, res, next) => {
        try {
            const { message, userId, context } = req.body;

            // Convert ISO date strings to Date objects in context if present
            if (context?.messages) {
                context.messages = context.messages.map((msg: { role: string; content: string; timestamp: string }) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            }

            const response = await chatbotService.generateResponse(
                message,
                userId,
                context as ConversationContext
            );
            
            res.json({
                status: 'success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
);

export const chatbotRoutes = router; 