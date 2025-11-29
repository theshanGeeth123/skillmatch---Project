import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

const pool = createPool({
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE_NAME,
  user: process.env.MYSQL_USER,
});

// NEW: function to create tables through the project (not manually in MySQL)
const initDatabase = async () => {
  const createPersonnelTableSQL = `
    CREATE TABLE IF NOT EXISTS personnel (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      role VARCHAR(100),
      experience_level ENUM('Junior','Mid-Level','Senior') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(createPersonnelTableSQL);
    console.log("✅ personnel table is ready");
  } catch (error) {
    console.error("❌ Error creating personnel table", error);
    throw error;
  }
};

const connectToDatabse = async () => {
  try {
    await pool.getConnection();
    console.log("Database connected successfully");

    // NEW: ensure tables exist
    await initDatabase();
  } catch (error) {
    console.log("Database connection failed", error);
    throw error;
  }
};

export { pool, connectToDatabse };
