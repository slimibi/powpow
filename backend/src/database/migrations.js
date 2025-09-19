import { query } from './connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTables = async () => {
  try {
    await query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dashboards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        layout JSONB DEFAULT '[]',
        filters JSONB DEFAULT '{}',
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS data_sources (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('file', 'database', 'api')),
        connection_string TEXT,
        file_path VARCHAR(500),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS charts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('bar', 'line', 'pie', 'scatter', 'kpi', 'map')),
        dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
        data_source_id UUID REFERENCES data_sources(id) ON DELETE CASCADE,
        config JSONB NOT NULL DEFAULT '{}',
        position JSONB DEFAULT '{"x": 0, "y": 0, "w": 4, "h": 4}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dashboard_shares (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        permission VARCHAR(20) DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(dashboard_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS data_cache (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        data_source_id UUID REFERENCES data_sources(id) ON DELETE CASCADE,
        cache_key VARCHAR(500) NOT NULL,
        data JSONB NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON dashboards(user_id);
      CREATE INDEX IF NOT EXISTS idx_charts_dashboard_id ON charts(dashboard_id);
      CREATE INDEX IF NOT EXISTS idx_data_sources_user_id ON data_sources(user_id);
      CREATE INDEX IF NOT EXISTS idx_dashboard_shares_dashboard_id ON dashboard_shares(dashboard_id);
      CREATE INDEX IF NOT EXISTS idx_data_cache_source_key ON data_cache(data_source_id, cache_key);
      CREATE INDEX IF NOT EXISTS idx_data_cache_expires ON data_cache(expires_at);
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const runMigrations = async () => {
  try {
    await createTables();
    console.log('🎉 All migrations completed successfully');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { createTables, runMigrations };