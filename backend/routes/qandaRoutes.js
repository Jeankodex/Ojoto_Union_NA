
const express = require('express');
const router = express.Router();
const QandaController = require('../controllers/qandaController');
const { verifyToken } = require('../utils/auth');

// All Q&A routes require authentication
router.use(verifyToken);

// QUESTION ROUTES
router.post('/questions', QandaController.createQuestion);           // Create question
router.get('/questions', QandaController.getQuestions);              // Get all questions
router.get('/questions/:id', QandaController.getQuestion);           // Get single question
router.post('/questions/:id/resolve', QandaController.markQuestionResolved); // Mark as resolved

// ANSWER ROUTES
router.post('/questions/:id/answers', QandaController.addAnswer);    // Add answer
router.get('/questions/:id/answers', QandaController.getAnswers);    // Get answers
router.post('/answers/:answerId/helpful', QandaController.markAnswerHelpful); // Mark answer helpful

module.exports = router;