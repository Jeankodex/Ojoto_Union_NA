
const QandA = require('../models/QandA');

class QandaController {
  // CREATE QUESTION
  static async createQuestion(req, res) {
    try {
      const userId = req.userId;
      const { title, content, category, is_urgent } = req.body;
      
      // Validation
      if (!title || !content || !category) {
        return res.status(400).json({
          success: false,
          error: 'Title, content, and category are required'
        });
      }
      
      if (content.length < 20) {
        return res.status(400).json({
          success: false,
          error: 'Content must be at least 20 characters'
        });
      }
      
      const questionData = {
        title,
        content,
        category,
        is_urgent: Boolean(is_urgent)
      };
      
      const newQuestion = await QandA.createQuestion(userId, questionData);
      
      res.status(201).json({
        success: true,
        message: 'Question posted successfully',
        data: newQuestion
      });
      
    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to post question'
      });
    }
  }
  
  // GET QUESTIONS
  static async getQuestions(req, res) {
    try {
      const filters = {
        category: req.query.category || 'all',
        status: req.query.status || 'all',
        search: req.query.search || '',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };
      
      const result = await QandA.getQuestions(filters);
      
      res.json({
        success: true,
        message: 'Questions retrieved successfully',
        data: result.questions,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
      
    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve questions'
      });
    }
  }
  
  // GET SINGLE QUESTION
  static async getQuestion(req, res) {
    try {
      const questionId = parseInt(req.params.id);
      
      // Increment views
      await QandA.incrementViews(questionId);
      
      const question = await QandA.getQuestionById(questionId);
      
      if (question) {
        res.json({
          success: true,
          message: 'Question retrieved successfully',
          data: question
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      
    } catch (error) {
      console.error('Get question error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve question'
      });
    }
  }
  
  // ADD ANSWER
  static async addAnswer(req, res) {
    try {
      const questionId = parseInt(req.params.id);
      const userId = req.userId;
      const { content } = req.body;
      
      if (!content || content.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Answer must be at least 2 characters'
        });
      }
      
      // Check if question exists
      const question = await QandA.getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      
      const answer = await QandA.addAnswer(questionId, userId, content.trim());
      
      res.status(201).json({
        success: true,
        message: 'Answer added successfully',
        data: answer
      });
      
    } catch (error) {
      console.error('Add answer error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add answer'
      });
    }
  }
  
  // GET ANSWERS
  static async getAnswers(req, res) {
    try {
      const questionId = parseInt(req.params.id);
      
      const answers = await QandA.getAnswers(questionId);
      
      // Mark helpful answers
      const parsedAnswers = answers.map(answer => ({
        ...answer,
        is_helpful: Boolean(answer.is_helpful)
      }));
      
      res.json({
        success: true,
        message: 'Answers retrieved successfully',
        data: parsedAnswers
      });
      
    } catch (error) {
      console.error('Get answers error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve answers'
      });
    }
  }
  
  // MARK ANSWER AS HELPFUL
  static async markAnswerHelpful(req, res) {
    try {
      const answerId = parseInt(req.params.answerId);
      
      const marked = await QandA.markAnswerHelpful(answerId);
      
      if (marked) {
        res.json({
          success: true,
          message: 'Answer marked as helpful'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Answer not found'
        });
      }
      
    } catch (error) {
      console.error('Mark helpful error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark answer as helpful'
      });
    }
  }
  
  // MARK QUESTION AS RESOLVED
  static async markQuestionResolved(req, res) {
    try {
      const questionId = parseInt(req.params.id);
      const userId = req.userId;
      
      // Check if user is question owner (optional)
      const question = await QandA.getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      
      const resolved = await QandA.markQuestionResolved(questionId);
      
      if (resolved) {
        res.json({
          success: true,
          message: 'Question marked as resolved'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      
    } catch (error) {
      console.error('Mark resolved error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark question as resolved'
      });
    }
  }
}

module.exports = QandaController;