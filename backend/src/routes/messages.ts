import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validateRequest';
import { MessageService } from '../services/MessageService';

const router = Router();
const messageService = new MessageService();

// Validation rules
const uploadMessagesValidation = [
  body('userId')
    .notEmpty()
    .withMessage('UserId is required')
    .isString()
    .withMessage('UserId must be a string')
    .trim(),
  body('messages')
    .isArray()
    .withMessage('Messages must be an array')
    .notEmpty()
    .withMessage('Messages array cannot be empty'),
  body('messages.*.text')
    .isString()
    .withMessage('Message text must be a string')
    .trim()
    .notEmpty()
    .withMessage('Message text cannot be empty'),
  body('messages.*.timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO 8601 date')
];

router.post(
  '/upload',
  validate(uploadMessagesValidation),
  async (req, res, next) => {
    try {
      const { userId, messages } = req.body;
      await messageService.uploadMessages(userId, messages);
      res.json({
        status: 'success',
        message: 'Messages uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/users/:userId',
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const messages = await messageService.getUserMessages(userId);
      res.json({
        status: 'success',
        data: { messages }
      });
    } catch (error) {
      next(error);
    }
  }
);

export const messageRoutes = router; 