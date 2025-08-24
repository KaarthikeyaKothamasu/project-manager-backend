const { Pool } = require('pg');
require('dotenv').config();

// The Pool will use the DATABASE_URL from your .env file automatically
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// We export a query function that will be used throughout the app
module.exports = {
  query: (text, params) => pool.query(text, params),
};