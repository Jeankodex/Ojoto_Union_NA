const { run, get, all } = require('../utils/db');

class Community {
  // CREATE A POST
  static async createPost(userId, postData) {
    const { title, content, category, tags, is_pinned, is_urgent } = postData;
    
    const sql = `
      INSERT INTO community_posts 
      (user_id, title, content, category, tags, attachments, is_pinned, is_urgent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await run(sql, [
      userId,
      title,
      content,
      category,
      JSON.stringify(tags || []),
      JSON.stringify([]), // attachments - empty for now
      is_pinned ? 1 : 0,
      is_urgent ? 1 : 0
    ]);
    
    return { id: result.id, ...postData, user_id: userId };
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
    
    let query = `
      SELECT 
        p.*,
        u.username,
        u.email,
        u.profile_picture as author_avatar,
        u.first_name || ' ' || u.surname as author_name
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Add filters
    if (category && category !== 'all') {
      query += ' AND p.category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Sorting
    const sortOptions = {
      newest: 'p.created_at DESC',
      most_commented: 'p.comments_count DESC',
      most_liked: 'p.likes DESC'
    };
    
    query += ` ORDER BY ${sortOptions[sort] || 'p.created_at DESC'}`;
    
    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Get posts
    const posts = await all(query, params);
    
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
    let countQuery = `SELECT COUNT(*) as total FROM community_posts p WHERE 1=1`;
    const countParams = [];
    
    if (category && category !== 'all') {
      countQuery += ' AND p.category = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const countResult = await get(countQuery, countParams);
    const total = countResult.total;
    
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
    const query = `
      SELECT 
        c.*,
        u.username,
        u.profile_picture as author_avatar,
        u.first_name || ' ' || u.surname as author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    
    return await all(query, [postId]);
  }
  
  // ADD A COMMENT
  static async addComment(postId, userId, content) {
    const sql = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `;
    
    const result = await run(sql, [postId, userId, content]);
    return { id: result.id, post_id: postId, user_id: userId, content };
  }
  
  // LIKE A POST
  static async likePost(postId) {
    const sql = `UPDATE community_posts SET likes = likes + 1 WHERE id = ?`;
    const result = await run(sql, [postId]);
    return result.changes > 0;
  }
  
  // GET SINGLE POST
  static async getPostById(postId) {
    const query = `
      SELECT 
        p.*,
        u.username,
        u.email,
        u.profile_picture as author_avatar,
        u.first_name || ' ' || u.surname as author_name
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    
    const post = await get(query, [postId]);
    
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