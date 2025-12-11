
const { run, get, all } = require('../utils/db');

class QandA {
  // CREATE QUESTION
  static async createQuestion(userId, questionData) {
    const { title, content, category, is_urgent } = questionData;
    
    const sql = `
      INSERT INTO questions 
      (user_id, title, content, category, is_urgent)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await run(sql, [
      userId,
      title,
      content,
      category,
      is_urgent ? 1 : 0
    ]);
    
    return { id: result.id, ...questionData, user_id: userId };
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
    
    let query = `
      SELECT 
        q.*,
        u.username,
        u.profile_picture as author_avatar,
        u.first_name || ' ' || u.surname as author_name
      FROM questions q
      JOIN users u ON q.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Add filters
    if (category && category !== 'all') {
      query += ' AND q.category = ?';
      params.push(category);
    }
    
    if (status === 'resolved') {
      query += ' AND q.is_resolved = 1';
    } else if (status === 'unanswered') {
      query += ' AND q.answers_count = 0';
    }
    
    if (search) {
      query += ' AND (q.title LIKE ? OR q.content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Sorting - newest or most answered
    query += ' ORDER BY q.created_at DESC';
    
    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Get questions
    const questions = await all(query, params);
    
    // Parse boolean fields
    const parsedQuestions = questions.map(q => ({
      ...q,
      is_urgent: Boolean(q.is_urgent),
      is_resolved: Boolean(q.is_resolved),
      views: q.views || 0,
      answers_count: q.answers_count || 0
    }));
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM questions q WHERE 1=1`;
    const countParams = [];
    
    if (category && category !== 'all') {
      countQuery += ' AND q.category = ?';
      countParams.push(category);
    }
    
    if (status === 'resolved') {
      countQuery += ' AND q.is_resolved = 1';
    } else if (status === 'unanswered') {
      countQuery += ' AND q.answers_count = 0';
    }
    
    if (search) {
      countQuery += ' AND (q.title LIKE ? OR q.content LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const countResult = await get(countQuery, countParams);
    const total = countResult.total;
    
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
    const query = `
      SELECT 
        q.*,
        u.username,
        u.profile_picture as author_avatar,
        u.first_name || ' ' || u.surname as author_name
      FROM questions q
      JOIN users u ON q.user_id = u.id
      WHERE q.id = ?
    `;
    
    const question = await get(query, [questionId]);
    
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
      VALUES (?, ?, ?)
    `;
    
    const result = await run(sql, [questionId, userId, content]);
    return { id: result.id, question_id: questionId, user_id: userId, content };
  }
  
  // GET ANSWERS FOR A QUESTION
  static async getAnswers(questionId) {
    const query = `
      SELECT 
        a.*,
        u.username,
        u.profile_picture as author_avatar,
        u.first_name || ' ' || u.surname as author_name
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `;
    
    return await all(query, [questionId]);
  }
  
  // MARK ANSWER AS HELPFUL
  static async markAnswerHelpful(answerId) {
    const sql = `UPDATE answers SET is_helpful = 1 WHERE id = ?`;
    const result = await run(sql, [answerId]);
    return result.changes > 0;
  }
  
  // MARK QUESTION AS RESOLVED
  static async markQuestionResolved(questionId) {
    const sql = `UPDATE questions SET is_resolved = 1 WHERE id = ?`;
    const result = await run(sql, [questionId]);
    return result.changes > 0;
  }
  
  // INCREMENT QUESTION VIEWS
  static async incrementViews(questionId) {
    const sql = `UPDATE questions SET views = views + 1 WHERE id = ?`;
    await run(sql, [questionId]);
  }
}

module.exports = QandA;