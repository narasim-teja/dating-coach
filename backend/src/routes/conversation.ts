import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validateRequest';
import { ConversationService } from '../services/ConversationService';

const router = Router();
const conversationService = new ConversationService();

// Validation rules
const generatePickupLinesValidation = [
  body('bio')
    .notEmpty()
    .withMessage('Bio is required')
    .isString()
    .withMessage('Bio must be a string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Bio must be between 1 and 500 characters'),
  body('userId')
    .optional()
    .isString()
    .withMessage('UserId must be a string')
    .trim()
];

router.post(
  '/generate',
  validate(generatePickupLinesValidation),
  async (req, res, next) => {
    try {
      const { bio, userId } = req.body;
      const lines = await conversationService.generatePickupLines(bio, userId);
      res.json({
        status: 'success',
        data: { lines }
      });
    } catch (error) {
      next(error);
    }
  }
);

export const conversationRoutes = router; 