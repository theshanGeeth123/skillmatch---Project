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
  // 1) Personnel table
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

  // 2) Skills table
  const createSkillsTableSQL = `
    CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category ENUM('Programming Language','Framework','Tool','Soft Skill') NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 3) Personnel-Skills junction table (many-to-many)
  // We use numeric proficiency: 1–5 (1=Beginner, 5=Expert)
  const createPersonnelSkillsTableSQL = `
    CREATE TABLE IF NOT EXISTS personnel_skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      personnel_id INT NOT NULL,
      skill_id INT NOT NULL,
      proficiency TINYINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_personnel_skill (personnel_id, skill_id),
      CONSTRAINT fk_personnel
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
    )
  `;

  try {
    await pool.query(createPersonnelTableSQL);
    console.log("✅ personnel table is ready");

    await pool.query(createSkillsTableSQL);
    console.log("✅ skills table is ready");

    await pool.query(createPersonnelSkillsTableSQL);
    console.log("✅ personnel_skills table is ready");
  } catch (error) {
    console.error("❌ Error creating tables", error);
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
