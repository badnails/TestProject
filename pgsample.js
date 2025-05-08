const { Pool } = require('pg');

// Replace these with your actual DB credentials
const pool = new Pool({
  user: 'postgres.sobpqvuzylwgzljorcsm',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Q4gEN_S57AHCm-6',
  port: 5432, // default PostgreSQL port
});

//lulusafayat

module.exports = pool