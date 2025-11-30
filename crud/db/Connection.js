import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

// Create the connection pool
const pool = createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
});

// Create tables through the project (not manually in MySQL)
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

  // 3) Personnel-Skills junction table
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

  // 4) Projects table
  const createProjectsTableSQL = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      start_date DATE,
      end_date DATE,
      status ENUM('Planning','Active','Completed') NOT NULL DEFAULT 'Planning',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 5) Project required skills table
  const createProjectRequiredSkillsTableSQL = `
    CREATE TABLE IF NOT EXISTS project_required_skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      skill_id INT NOT NULL,
      min_proficiency TINYINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_project_skill (project_id, skill_id),
      CONSTRAINT fk_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_project_skill
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

    await pool.query(createProjectsTableSQL);
    console.log("✅ projects table is ready");

    await pool.query(createProjectRequiredSkillsTableSQL);
    console.log("✅ project_required_skills table is ready");
  } catch (error) {
    console.error("❌ Error creating tables", error);
    throw error;
  }
};


// NOTE: name kept as connectToDatabse to match your existing imports
const connectToDatabse = async () => {
  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(
        `Trying to connect to database (attempt ${attempt}/${maxRetries})...`
      );

      // Test connection
      await pool.getConnection();
      console.log("✅ Database connected successfully");

      // Ensure tables exist
      await initDatabase();
      return; // success – exit the function
    } catch (error) {
      console.error(
        `❌ Database connection failed (attempt ${attempt}/${maxRetries}):`,
        error.message || error
      );

      if (attempt >= maxRetries) {
        console.error("❌ Giving up connecting to database after max retries");
        throw error;
      }

      // Wait 3 seconds before next try
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

export { pool, connectToDatabse };
