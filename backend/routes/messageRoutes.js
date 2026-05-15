const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/authMiddleware');

// Public route to send a message
router.post('/', messageController.createMessage);

// Admin routes
router.get('/', authenticate, messageController.getMessages);
router.put('/:id/read', authenticate, messageController.markAsRead);
router.delete('/:id', authenticate, messageController.deleteMessage);

module.exports = router;
