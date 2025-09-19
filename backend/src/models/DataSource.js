import { query } from '../database/connection.js';

export const DataSource = {
  async create(dataSourceData) {
    const { name, type, connectionString, filePath, userId, metadata = {} } = dataSourceData;
    
    const result = await query(
      'INSERT INTO data_sources (name, type, connection_string, file_path, user_id, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, type, connectionString, filePath, userId, JSON.stringify(metadata)]
    );
    
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM data_sources WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM data_sources WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM data_sources WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].count);
    
    return {
      dataSources: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async update(id, userId, updateData) {
    const allowedFields = ['name', 'connection_string', 'metadata'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'metadata') {
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
    const queryText = `UPDATE data_sources SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
    
    const result = await query(queryText, values);
    return result.rows[0];
  },

  async delete(id, userId) {
    const result = await query('DELETE FROM data_sources WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    return result.rows[0];
  },

  async checkOwnership(id, userId) {
    const result = await query('SELECT id FROM data_sources WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows.length > 0;
  },

  async getPublicDataSources(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT ds.*, u.first_name, u.last_name FROM data_sources ds JOIN users u ON ds.user_id = u.id WHERE ds.metadata->>\'public\' = \'true\' ORDER BY ds.created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM data_sources WHERE metadata->>\'public\' = \'true\'');
    const total = parseInt(countResult.rows[0].count);
    
    return {
      dataSources: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async storeDataCache(dataSourceId, cacheKey, data, expiresInMinutes = 60) {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    
    const result = await query(
      'INSERT INTO data_cache (data_source_id, cache_key, data, expires_at) VALUES ($1, $2, $3, $4) ON CONFLICT (data_source_id, cache_key) DO UPDATE SET data = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP RETURNING *',
      [dataSourceId, cacheKey, JSON.stringify(data), expiresAt]
    );
    
    return result.rows[0];
  },

  async getDataCache(dataSourceId, cacheKey) {
    const result = await query(
      'SELECT data FROM data_cache WHERE data_source_id = $1 AND cache_key = $2 AND expires_at > CURRENT_TIMESTAMP',
      [dataSourceId, cacheKey]
    );
    
    return result.rows.length > 0 ? JSON.parse(result.rows[0].data) : null;
  },

  async clearExpiredCache() {
    const result = await query('DELETE FROM data_cache WHERE expires_at <= CURRENT_TIMESTAMP RETURNING COUNT(*)');
    return result.rows[0].count;
  }
};