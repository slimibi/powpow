import { query } from './connection.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await query(`
      INSERT INTO users (email, password, first_name, last_name, role) 
      VALUES 
        ('admin@example.com', $1, 'Admin', 'User', 'admin'),
        ('user@example.com', $2, 'Demo', 'User', 'user')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword, await bcrypt.hash('user123', 12)]);

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedDashboards = async () => {
  try {
    // Get the admin user ID
    const adminResult = await query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    if (adminResult.rows.length === 0) {
      throw new Error('Admin user not found');
    }
    const adminId = adminResult.rows[0].id;

    await query(`
      INSERT INTO dashboards (title, description, user_id, is_public) 
      VALUES 
        ('Sales Overview', 'Comprehensive sales analytics dashboard', $1, true),
        ('Marketing Metrics', 'Key marketing performance indicators', $1, false)
      ON CONFLICT DO NOTHING;
    `, [adminId]);

    console.log('✅ Dashboards seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding dashboards:', error);
    throw error;
  }
};

const seedDataSources = async () => {
  try {
    // Get the admin user ID
    const adminResult = await query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    if (adminResult.rows.length === 0) {
      throw new Error('Admin user not found');
    }
    const adminId = adminResult.rows[0].id;

    await query(`
      INSERT INTO data_sources (name, type, user_id, metadata) 
      VALUES 
        ('Sample Sales Data', 'file', $1, '{"columns": ["date", "sales", "region"], "rows": 100}'),
        ('Customer Database', 'database', $1, '{"tables": ["customers", "orders"], "connection": "postgresql"}')
      ON CONFLICT DO NOTHING;
    `, [adminId]);

    console.log('✅ Data sources seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data sources:', error);
    throw error;
  }
};

const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedDashboards();
    await seedDataSources();
    
    console.log('🎉 Database seeded successfully!');
    console.log('👤 Login credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
}

export { runSeed, seedUsers, seedDashboards, seedDataSources };