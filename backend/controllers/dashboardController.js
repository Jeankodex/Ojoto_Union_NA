const { query } = require('../database/init');

class DashboardController {
  static async getStats(req, res) {
    try {
      const userId = req.userId;

      // Ensure the user's stats row exists
      await query(`
        INSERT INTO user_stats (user_id)
        SELECT $1
        WHERE NOT EXISTS (SELECT 1 FROM user_stats WHERE user_id = $1)
      `, [userId]);

      const statsResult = await query(
        `SELECT * FROM user_stats WHERE user_id = $1`,
        [userId]
      );

      const userStats = statsResult.rows[0] || {
        posts_count: 0,
        comments_count: 0,
        questions_count: 0,
        answers_count: 0,
        connections_count: 0,
        events_attended: 0,
        last_active: null
      };

      const overviewResult = await query(
        `
          SELECT
            COUNT(DISTINCT cp.id) AS posts,
            COUNT(DISTINCT c.id) AS comments,
            COUNT(DISTINCT q.id) AS questions,
            COUNT(DISTINCT a.id) AS answers,
            COUNT(DISTINCT conn.id) AS connections,
            COUNT(DISTINCT vs.id) AS events_attended
          FROM users u
          LEFT JOIN community_posts cp ON cp.user_id = u.id
          LEFT JOIN comments c ON c.user_id = u.id
          LEFT JOIN questions q ON q.user_id = u.id
          LEFT JOIN answers a ON a.user_id = u.id
          LEFT JOIN connections conn ON conn.user1_id = u.id OR conn.user2_id = u.id
          LEFT JOIN volunteer_signups vs ON vs.user_id = u.id
          WHERE u.id = $1
        `,
        [userId]
      );

      const overview = overviewResult.rows[0] || {
        posts: 0,
        comments: 0,
        questions: 0,
        answers: 0,
        connections: 0,
        events_attended: 0
      };

      const recentPostsResult = await query(
        `
          SELECT p.id, p.title, p.content, p.category, p.created_at, p.likes, p.comments_count
          FROM community_posts p
          WHERE p.user_id = $1
          ORDER BY p.created_at DESC
          LIMIT 3
        `,
        [userId]
      );

      const recentQuestionsResult = await query(
        `
          SELECT q.id, q.title, q.content, q.category, q.created_at, q.answers_count
          FROM questions q
          WHERE q.user_id = $1
          ORDER BY q.created_at DESC
          LIMIT 3
        `,
        [userId]
      );

      res.json({
        success: true,
        data: {
          userStats,
          overview,
          recentPosts: recentPostsResult.rows,
          recentQuestions: recentQuestionsResult.rows
        }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard stats'
      });
    }
  }
}

module.exports = DashboardController;
