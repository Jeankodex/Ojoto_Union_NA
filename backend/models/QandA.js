// models/QandA.js
const { query } = require('../database/init'); // ← Changed import

class QandA {
  // CREATE QUESTION
  static async createQuestion(userId, questionData) {
    const { title, content, category, is_urgent } = questionData;
    
    const sql = `
      INSERT INTO questions 
      (user_id, title, content, category, is_urgent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const result = await query(sql, [
      userId,
      title,
      content,
      category,
      is_urgent
    ]);

    await query(
      `UPDATE user_stats SET questions_count = questions_count + 1 WHERE user_id = $1`,
      [userId]
    );
    
    return { id: result.rows[0].id, ...questionData, user_id: userId };
  }
  
  // GET ALL QUESTIONS WITH FILTERS
  static async getQuestions(filters = {}) {
    const { 
      category = 'all', 
      status = 'all', // all, resolved, unanswered
      search = '', 
      page = 1, 
      limit = 20 
    } = filters;
    
    let sql = `
      SELECT 
        q.*,
        u.username,
        prof.profile_picture as author_avatar,
        CONCAT(u.first_name, ' ', u.surname) as author_name
      FROM questions q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN profiles prof ON u.id = prof.user_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Add filters
    if (category && category !== 'all') {
      sql += ` AND q.category = $${paramIndex++}`;
      params.push(category);
    }
    
    if (status === 'resolved') {
      sql += ' AND q.is_resolved = TRUE';
    } else if (status === 'unanswered') {
      sql += ' AND q.answers_count = 0';
    }
    
    if (search) {
      sql += ` AND (q.title ILIKE $${paramIndex} OR q.content ILIKE $${paramIndex + 1})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      paramIndex += 2;
    }
    
    // Sorting
    sql += ' ORDER BY q.created_at DESC';
    
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    // Get questions
    const questionsResult = await query(sql, params);
    const questions = questionsResult.rows;
    
    // Parse boolean fields
    const parsedQuestions = questions.map(q => ({
      ...q,
      is_urgent: Boolean(q.is_urgent),
      is_resolved: Boolean(q.is_resolved),
      views: q.views || 0,
      answers_count: q.answers_count || 0
    }));
    
    // Get total count
    let countSql = `SELECT COUNT(*) as total FROM questions q WHERE 1=1`;
    const countParams = [];
    let countIndex = 1;
    
    if (category && category !== 'all') {
      countSql += ` AND q.category = $${countIndex++}`;
      countParams.push(category);
    }
    
    if (status === 'resolved') {
      countSql += ' AND q.is_resolved = TRUE';
    } else if (status === 'unanswered') {
      countSql += ' AND q.answers_count = 0';
    }
    
    if (search) {
      countSql += ` AND (q.title ILIKE $${countIndex} OR q.content ILIKE $${countIndex + 1})`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    return {
      questions: parsedQuestions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // GET SINGLE QUESTION
  static async getQuestionById(questionId) {
    const sql = `
      SELECT 
        q.*,
        u.username,
        prof.profile_picture as author_avatar,
        CONCAT(u.first_name, ' ', u.surname) as author_name
      FROM questions q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN profiles prof ON u.id = prof.user_id
      WHERE q.id = $1
    `;
    
    const result = await query(sql, [questionId]);
    let question = result.rows[0];
    
    if (question) {
      question.is_urgent = Boolean(question.is_urgent);
      question.is_resolved = Boolean(question.is_resolved);
    }
    
    return question;
  }
  
  // ADD ANSWER
  static async addAnswer(questionId, userId, content) {
    const sql = `
      INSERT INTO answers (question_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    
    const result = await query(sql, [questionId, userId, content]);

    await query(
      `UPDATE user_stats SET answers_count = answers_count + 1 WHERE user_id = $1`,
      [userId]
    );

    return { 
      id: result.rows[0].id, 
      question_id: questionId, 
      user_id: userId, 
      content 
    };
  }
  
  // GET ANSWERS FOR A QUESTION
  static async getAnswers(questionId) {
    const sql = `
      SELECT 
        a.*,
        u.username,
        prof.profile_picture as author_avatar,
        CONCAT(u.first_name, ' ', u.surname) as author_name
      FROM answers a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN profiles prof ON u.id = prof.user_id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC
    `;
    
    const result = await query(sql, [questionId]);
    return result.rows;
  }
  
  // MARK ANSWER AS HELPFUL
  static async markAnswerHelpful(answerId) {
    const sql = `UPDATE answers SET is_helpful = TRUE WHERE id = $1`;
    const result = await query(sql, [answerId]);
    return result.rowCount > 0;
  }
  
  // MARK QUESTION AS RESOLVED
  static async markQuestionResolved(questionId) {
    const sql = `UPDATE questions SET is_resolved = TRUE WHERE id = $1`;
    const result = await query(sql, [questionId]);
    return result.rowCount > 0;
  }
  
  // INCREMENT QUESTION VIEWS
  static async incrementViews(questionId) {
    const sql = `UPDATE questions SET views = views + 1 WHERE id = $1`;
    await query(sql, [questionId]);
  }
}

module.exports = QandA;