const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.sobpqvuzylwgzljorcsm',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Q4gEN_S57AHCm-6',
  port: 5432, // default PostgreSQL port
});

module.exports = pool