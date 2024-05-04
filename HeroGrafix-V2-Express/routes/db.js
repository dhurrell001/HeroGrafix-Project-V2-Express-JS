const { Pool } = require("pg");

// Create a new pool instance with your database connection details
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Herografix_V2",
  password: "password",
  port: 5432,
});

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Connected to the database:", res.rows[0].now);
  }
});

// Export the pool for use in other modules
module.exports = pool;
