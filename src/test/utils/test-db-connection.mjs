import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'contribution_metrics',
});

try {
  console.log('Attempting to connect to PostgreSQL...');
  await client.connect();
  console.log('✅ Successfully connected to PostgreSQL');
  
  const result = await client.query('SELECT version()');
  console.log('✅ Database version:', result.rows[0].version);
  
  // Test if database exists
  const dbCheck = await client.query('SELECT current_database()');
  console.log('✅ Current database:', dbCheck.rows[0].current_database);
  
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  console.error('Error details:', error);
} finally {
  await client.end();
  console.log('Connection closed');
}
