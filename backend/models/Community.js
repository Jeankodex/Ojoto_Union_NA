// models/Community.js
const { query } = require('../database/init'); // ← Changed import

class Community {
  // CREATE A POST
  static async createPost(userId, postData) {
    const { title, content, category, tags, is_pinned, is_urgent } = postData;
    
    const sql = `
      INSERT INTO community_posts 
      (user_id, title, content, category, tags, attachments, is_pinned, is_urgent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    
    const result = await query(sql, [
      userId,
      title,
      content,
      category,
      JSON.stringify(tags || []),
      JSON.stringify([]), // attachments - empty for now
      is_pinned,
      is_urgent
    ]);
    
    return { id: result.rows[0].id, ...postData, user_id: userId };
  }
  
  // GET ALL POSTS WITH FILTERS
  static async getPosts(filters = {}) {
    const { 
      category = 'all', 
      sort = 'newest', 
      search = '', 
      page = 1, 
      limit = 20 
    } = filters;
    
    let sql = `
      SELECT 
        p.*,
        u.username,
        u.email,
        prof.profile_picture as author_avatar,
        CONCAT(u.first_name, ' ', u.surname) as author_name
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles prof ON u.id = prof.user_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Add filters
    if (category && category !== 'all') {
      sql += ` AND p.category = $${paramIndex++}`;
      params.push(category);
    }
    
    if (search) {
      sql += ` AND (p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex + 1})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      paramIndex += 2;
    }
    
    // Sorting
    const sortOptions = {
      newest: 'p.created_at DESC',
      most_commented: 'p.comments_count DESC',
      most_liked: 'p.likes DESC'
    };
    
    sql += ` ORDER BY ${sortOptions[sort] || 'p.created_at DESC'}`;
    
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    // Get posts
    const postsResult = await query(sql, params);
    const posts = postsResult.rows;
    
    // Parse JSON fields
    const parsedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      attachments: post.attachments ? JSON.parse(post.attachments) : [],
      is_pinned: Boolean(post.is_pinned),
      is_urgent: Boolean(post.is_urgent),
      likes: post.likes || 0,
      comments_count: post.comments_count || 0
    }));
    
    // Get total count
    let countSql = `SELECT COUNT(*) as total FROM community_posts p WHERE 1=1`;
    const countParams = [];
    let countIndex = 1;
    
    if (category && category !== 'all') {
      countSql += ` AND p.category = $${countIndex++}`;
      countParams.push(category);
    }
    
    if (search) {
      countSql += ` AND (p.title ILIKE $${countIndex} OR p.content ILIKE $${countIndex + 1})`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    return {
      posts: parsedPosts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // GET COMMENTS FOR A POST
  static async getComments(postId) {
    const sql = `
      SELECT 
        c.*,
        u.username,
        prof.profile_picture as author_avatar,
        CONCAT(u.first_name, ' ', u.surname) as author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN profiles prof ON u.id = prof.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `;
    
    const result = await query(sql, [postId]);
    return result.rows;
  }
  
  // ADD A COMMENT
  static async addComment(postId, userId, content) {
    const sql = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    
    const result = await query(sql, [postId, userId, content]);
    return { 
      id: result.rows[0].id, 
      post_id: postId, 
      user_id: userId, 
      content 
    };
  }
  
  // LIKE A POST
  static async likePost(postId) {
    const sql = `UPDATE community_posts SET likes = likes + 1 WHERE id = $1`;
    const result = await query(sql, [postId]);
    return result.rowCount > 0;
  }
  
  // GET SINGLE POST
  static async getPostById(postId) {
    const sql = `
      SELECT 
        p.*,
        u.username,
        u.email,
        prof.profile_picture as author_avatar,
        CONCAT(u.first_name, ' ', u.surname) as author_name
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles prof ON u.id = prof.user_id
      WHERE p.id = $1
    `;
    
    const result = await query(sql, [postId]);
    let post = result.rows[0];
    
    if (post) {
      post.tags = post.tags ? JSON.parse(post.tags) : [];
      post.attachments = post.attachments ? JSON.parse(post.attachments) : [];
      post.is_pinned = Boolean(post.is_pinned);
      post.is_urgent = Boolean(post.is_urgent);
    }
    
    return post;
  }
}

module.exports = Community;