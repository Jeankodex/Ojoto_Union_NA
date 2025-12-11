const Community = require('../models/Community');

class CommunityController {
  // CREATE POST
  static async createPost(req, res) {
    try {
      const userId = req.userId; // From your verifyToken middleware
      const { title, content, category, tags, is_pinned, is_urgent } = req.body;
      
      // Basic validation
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
      
      const postData = {
        title,
        content,
        category,
        tags: tags || [],
        is_pinned: Boolean(is_pinned),
        is_urgent: Boolean(is_urgent)
      };
      
      const newPost = await Community.createPost(userId, postData);
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: newPost
      });
      
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create post'
      });
    }
  }
  
  // GET POSTS
  static async getPosts(req, res) {
    try {
      const filters = {
        category: req.query.category || 'all',
        sort: req.query.sort || 'newest',
        search: req.query.search || '',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };
      
      const result = await Community.getPosts(filters);
      
      res.json({
        success: true,
        message: 'Posts retrieved successfully',
        data: result.posts,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
      
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve posts'
      });
    }
  }
  
  // ADD COMMENT
  static async addComment(req, res) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.userId;
      const { content } = req.body;
      
      if (!content || content.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Comment must be at least 2 characters'
        });
      }
      
      // Check if post exists
      const post = await Community.getPostById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }
      
      const comment = await Community.addComment(postId, userId, content.trim());
      
      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
      });
      
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add comment'
      });
    }
  }
  
  // GET COMMENTS
  static async getComments(req, res) {
    try {
      const postId = parseInt(req.params.id);
      
      const comments = await Community.getComments(postId);
      
      res.json({
        success: true,
        message: 'Comments retrieved successfully',
        data: comments
      });
      
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve comments'
      });
    }
  }
  
  // LIKE POST
  static async likePost(req, res) {
    try {
      const postId = parseInt(req.params.id);
      
      const liked = await Community.likePost(postId);
      
      if (liked) {
        res.json({
          success: true,
          message: 'Post liked successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }
      
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to like post'
      });
    }
  }
  
  // GET SINGLE POST
  static async getPost(req, res) {
    try {
      const postId = parseInt(req.params.id);
      
      const post = await Community.getPostById(postId);
      
      if (post) {
        res.json({
          success: true,
          message: 'Post retrieved successfully',
          data: post
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }
      
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve post'
      });
    }
  }
}

module.exports = CommunityController;