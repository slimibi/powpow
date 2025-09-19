import { query } from '../database/connection.js';

export const Dashboard = {
  async create(dashboardData) {
    const { title, description, userId, layout = [], filters = {}, isPublic = false } = dashboardData;
    
    const result = await query(
      'INSERT INTO dashboards (title, description, user_id, layout, filters, is_public) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, userId, JSON.stringify(layout), JSON.stringify(filters), isPublic]
    );
    
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM dashboards WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM dashboards WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM dashboards WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].count);
    
    return {
      dashboards: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async findPublic(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT d.*, u.first_name, u.last_name FROM dashboards d JOIN users u ON d.user_id = u.id WHERE d.is_public = true ORDER BY d.updated_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM dashboards WHERE is_public = true');
    const total = parseInt(countResult.rows[0].count);
    
    return {
      dashboards: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async update(id, userId, updateData) {
    const allowedFields = ['title', 'description', 'layout', 'filters', 'is_public'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (['layout', 'filters'].includes(key)) {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id, userId);
    const queryText = `UPDATE dashboards SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
    
    const result = await query(queryText, values);
    return result.rows[0];
  },

  async delete(id, userId) {
    const result = await query('DELETE FROM dashboards WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    return result.rows[0];
  },

  async checkOwnership(id, userId) {
    const result = await query('SELECT id FROM dashboards WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows.length > 0;
  },

  async checkAccess(id, userId) {
    const ownershipResult = await query('SELECT id FROM dashboards WHERE id = $1 AND user_id = $2', [id, userId]);
    if (ownershipResult.rows.length > 0) {
      return { hasAccess: true, permission: 'owner' };
    }

    const shareResult = await query('SELECT permission FROM dashboard_shares WHERE dashboard_id = $1 AND user_id = $2', [id, userId]);
    if (shareResult.rows.length > 0) {
      return { hasAccess: true, permission: shareResult.rows[0].permission };
    }

    const publicResult = await query('SELECT id FROM dashboards WHERE id = $1 AND is_public = true', [id]);
    if (publicResult.rows.length > 0) {
      return { hasAccess: true, permission: 'view' };
    }

    return { hasAccess: false, permission: null };
  },

  async shareWith(dashboardId, userId, targetUserId, permission = 'view') {
    const ownershipCheck = await this.checkOwnership(dashboardId, userId);
    if (!ownershipCheck) {
      throw new Error('Only dashboard owners can share dashboards');
    }

    const result = await query(
      'INSERT INTO dashboard_shares (dashboard_id, user_id, permission) VALUES ($1, $2, $3) ON CONFLICT (dashboard_id, user_id) DO UPDATE SET permission = $3, created_at = CURRENT_TIMESTAMP RETURNING *',
      [dashboardId, targetUserId, permission]
    );
    
    return result.rows[0];
  },

  async getShares(dashboardId, userId) {
    const ownershipCheck = await this.checkOwnership(dashboardId, userId);
    if (!ownershipCheck) {
      throw new Error('Only dashboard owners can view shares');
    }

    const result = await query(
      'SELECT ds.*, u.email, u.first_name, u.last_name FROM dashboard_shares ds JOIN users u ON ds.user_id = u.id WHERE ds.dashboard_id = $1',
      [dashboardId]
    );
    
    return result.rows;
  },

  async removeShare(dashboardId, userId, targetUserId) {
    const ownershipCheck = await this.checkOwnership(dashboardId, userId);
    if (!ownershipCheck) {
      throw new Error('Only dashboard owners can remove shares');
    }

    const result = await query('DELETE FROM dashboard_shares WHERE dashboard_id = $1 AND user_id = $2 RETURNING id', [dashboardId, targetUserId]);
    return result.rows[0];
  },

  async getSharedWithMe(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT d.*, ds.permission, u.first_name as owner_first_name, u.last_name as owner_last_name FROM dashboard_shares ds JOIN dashboards d ON ds.dashboard_id = d.id JOIN users u ON d.user_id = u.id WHERE ds.user_id = $1 ORDER BY ds.created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM dashboard_shares WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].count);
    
    return {
      dashboards: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
};