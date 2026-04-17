// models/Volunteer.js
const { query } = require('../database/init'); // ← Changed import

class Volunteer {
  // CREATE VOLUNTEER OPPORTUNITY
  static async createOpportunity(userId, opportunityData) {
    const {
      title, organization, description, category, location,
      time_commitment, skills_needed, requirements, is_urgent,
      contact_email, contact_phone, date, slots
    } = opportunityData;
    
    const sql = `
      INSERT INTO volunteer_opportunities 
      (user_id, title, organization, description, category, location,
       time_commitment, skills_needed, requirements, is_urgent,
       contact_email, contact_phone, date, slots)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;
    
    const result = await query(sql, [
      userId,
      title,
      organization,
      description,
      category,
      location,
      time_commitment || '',
      skills_needed || '',
      requirements || '',
      is_urgent,
      contact_email || '',
      contact_phone || '',
      date,
      slots || 1
    ]);
    
    return { id: result.rows[0].id, ...opportunityData, user_id: userId };
  }
  
  // GET ALL OPPORTUNITIES WITH FILTERS
  static async getOpportunities(filters = {}) {
    const { 
      category = 'all', 
      search = '', 
      page = 1, 
      limit = 20 
    } = filters;
    
    let sql = `
      SELECT 
        vo.*,
        CONCAT(u.first_name, ' ', u.surname) as created_by_name,
        u.email as created_by_email
      FROM volunteer_opportunities vo
      JOIN users u ON vo.user_id = u.id
      WHERE vo.status = 'open'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Filter by category
    if (category && category !== 'all') {
      sql += ` AND vo.category = $${paramIndex++}`;
      params.push(category);
    }
    
    // Search filter
    if (search) {
      sql += ` AND (vo.title ILIKE $${paramIndex} OR vo.organization ILIKE $${paramIndex + 1} OR vo.description ILIKE $${paramIndex + 2})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      paramIndex += 3;
    }
    
    // Order by urgent first, then date
    sql += ' ORDER BY vo.is_urgent DESC, vo.created_at DESC';
    
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    // Get opportunities
    const oppsResult = await query(sql, params);
    const opportunities = oppsResult.rows;
    
    // Parse boolean fields
    const parsedOpportunities = opportunities.map(opp => ({
      ...opp,
      is_urgent: Boolean(opp.is_urgent),
      slots: opp.slots || 1,
      signups_count: opp.signups_count || 0
    }));
    
    // Get total count
    let countSql = `SELECT COUNT(*) as total FROM volunteer_opportunities vo WHERE vo.status = 'open'`;
    const countParams = [];
    let countIndex = 1;
    
    if (category && category !== 'all') {
      countSql += ` AND vo.category = $${countIndex++}`;
      countParams.push(category);
    }
    
    if (search) {
      countSql += ` AND (vo.title ILIKE $${countIndex} OR vo.organization ILIKE $${countIndex + 1} OR vo.description ILIKE $${countIndex + 2})`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    return {
      opportunities: parsedOpportunities,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // GET SINGLE OPPORTUNITY BY ID
  static async getOpportunityById(opportunityId) {
    const sql = `
      SELECT 
        vo.*,
        CONCAT(u.first_name, ' ', u.surname) as created_by_name,
        u.email as created_by_email,
        u.phone as created_by_phone
      FROM volunteer_opportunities vo
      JOIN users u ON vo.user_id = u.id
      WHERE vo.id = $1
    `;
    
    const result = await query(sql, [opportunityId]);
    let opportunity = result.rows[0];
    
    if (opportunity) {
      opportunity.is_urgent = Boolean(opportunity.is_urgent);
      opportunity.signups_count = opportunity.signups_count || 0;
    }
    
    return opportunity;
  }
  
  // CREATE VOLUNTEER APPLICATION/SIGNUP
  static async createApplication(opportunityId, userId, applicationData) {
    const { skills, message } = applicationData;
    
    // Check if already applied
    const existingResult = await query(
      'SELECT id FROM volunteer_signups WHERE opportunity_id = $1 AND user_id = $2',
      [opportunityId, userId]
    );
    
    if (existingResult.rows.length > 0) {
      throw new Error('You have already applied for this opportunity');
    }
    
    const sql = `
      INSERT INTO volunteer_signups (opportunity_id, user_id, skills, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    
    const result = await query(sql, [opportunityId, userId, skills, message || '']);
    return { 
      id: result.rows[0].id, 
      opportunity_id: opportunityId, 
      user_id: userId, 
      ...applicationData 
    };
  }
  
  // GET APPLICATIONS FOR AN OPPORTUNITY
  static async getApplications(opportunityId) {
    const sql = `
      SELECT 
        vs.*,
        u.first_name,
        u.surname,
        u.email,
        u.phone,
        CONCAT(u.first_name, ' ', u.surname) as applicant_name
      FROM volunteer_signups vs
      JOIN users u ON vs.user_id = u.id
      WHERE vs.opportunity_id = $1
      ORDER BY vs.applied_at DESC
    `;
    
    const result = await query(sql, [opportunityId]);
    return result.rows;
  }
  
  // GET USER'S APPLICATIONS
  static async getUserApplications(userId) {
    const sql = `
      SELECT 
        vs.*,
        vo.title,
        vo.organization,
        vo.category,
        vo.location,
        vo.status as opportunity_status
      FROM volunteer_signups vs
      JOIN volunteer_opportunities vo ON vs.opportunity_id = vo.id
      WHERE vs.user_id = $1
      ORDER BY vs.applied_at DESC
    `;
    
    const result = await query(sql, [userId]);
    return result.rows;
  }
  
  // UPDATE APPLICATION STATUS
  static async updateApplicationStatus(applicationId, status) {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    const sql = `UPDATE volunteer_signups SET status = $1 WHERE id = $2`;
    const result = await query(sql, [status, applicationId]);
    return result.rowCount > 0;
  }
  
  // GET OPPORTUNITY STATS
  static async getOpportunityStats(opportunityId) {
    const sql = `
      SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM volunteer_signups
      WHERE opportunity_id = $1
    `;
    
    const result = await query(sql, [opportunityId]);
    return result.rows[0];
  }
}

module.exports = Volunteer;