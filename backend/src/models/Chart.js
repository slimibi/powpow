import { query } from '../database/connection.js';

export const Chart = {
  async create(chartData) {
    const { title, type, dashboardId, dataSourceId, config = {}, position = { x: 0, y: 0, w: 4, h: 4 } } = chartData;
    
    const result = await query(
      'INSERT INTO charts (title, type, dashboard_id, data_source_id, config, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, type, dashboardId, dataSourceId, JSON.stringify(config), JSON.stringify(position)]
    );
    
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM charts WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByDashboardId(dashboardId) {
    const result = await query(
      'SELECT c.*, ds.name as data_source_name, ds.type as data_source_type FROM charts c LEFT JOIN data_sources ds ON c.data_source_id = ds.id WHERE c.dashboard_id = $1 ORDER BY c.created_at ASC',
      [dashboardId]
    );
    return result.rows;
  },

  async update(id, updateData) {
    const allowedFields = ['title', 'type', 'config', 'position', 'data_source_id'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (['config', 'position'].includes(key)) {
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

    values.push(id);
    const queryText = `UPDATE charts SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    
    const result = await query(queryText, values);
    return result.rows[0];
  },

  async delete(id) {
    const result = await query('DELETE FROM charts WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },

  async validateChartConfig(type, config) {
    const validTypes = ['bar', 'line', 'pie', 'scatter', 'kpi', 'map'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid chart type: ${type}`);
    }

    const requiredFields = {
      bar: ['xAxis', 'yAxis'],
      line: ['xAxis', 'yAxis'],
      pie: ['valueField', 'labelField'],
      scatter: ['xAxis', 'yAxis'],
      kpi: ['valueField'],
      map: ['locationField', 'valueField']
    };

    const required = requiredFields[type] || [];
    const missing = required.filter(field => !config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields for ${type} chart: ${missing.join(', ')}`);
    }

    return true;
  },

  async bulkUpdatePositions(updates) {
    const client = await query('BEGIN');
    
    try {
      for (const update of updates) {
        await query(
          'UPDATE charts SET position = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [JSON.stringify(update.position), update.id]
        );
      }
      
      await query('COMMIT');
      return true;
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  async duplicate(id, newDashboardId = null) {
    const chart = await this.findById(id);
    if (!chart) {
      throw new Error('Chart not found');
    }

    const result = await query(
      'INSERT INTO charts (title, type, dashboard_id, data_source_id, config, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        `${chart.title} (Copy)`,
        chart.type,
        newDashboardId || chart.dashboard_id,
        chart.data_source_id,
        chart.config,
        JSON.stringify({ ...JSON.parse(chart.position), x: JSON.parse(chart.position).x + 2, y: JSON.parse(chart.position).y + 2 })
      ]
    );
    
    return result.rows[0];
  },

  async getChartData(chartId, filters = {}) {
    const chart = await this.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    const dataSourceResult = await query('SELECT * FROM data_sources WHERE id = $1', [chart.data_source_id]);
    if (dataSourceResult.rows.length === 0) {
      throw new Error('Data source not found');
    }

    const dataSource = dataSourceResult.rows[0];
    const cacheKey = `chart_data_${chartId}_${JSON.stringify(filters)}`;
    
    let data = await query('SELECT data FROM data_cache WHERE data_source_id = $1 AND cache_key = $2 AND expires_at > CURRENT_TIMESTAMP', [dataSource.id, cacheKey]);
    
    if (data.rows.length > 0) {
      return JSON.parse(data.rows[0].data);
    }

    const fullDataCacheKey = `full_data_${dataSource.id}`;
    const fullDataResult = await query('SELECT data FROM data_cache WHERE data_source_id = $1 AND cache_key = $2 AND expires_at > CURRENT_TIMESTAMP', [dataSource.id, fullDataCacheKey]);
    
    if (fullDataResult.rows.length === 0) {
      throw new Error('Data not available in cache');
    }

    let chartData = JSON.parse(fullDataResult.rows[0].data);

    if (Object.keys(filters).length > 0) {
      chartData = chartData.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
          if (Array.isArray(value)) {
            return value.includes(row[key]);
          }
          return row[key] === value;
        });
      });
    }

    await query(
      'INSERT INTO data_cache (data_source_id, cache_key, data, expires_at) VALUES ($1, $2, $3, $4)',
      [dataSource.id, cacheKey, JSON.stringify(chartData), new Date(Date.now() + 30 * 60 * 1000)]
    );

    return chartData;
  }
};