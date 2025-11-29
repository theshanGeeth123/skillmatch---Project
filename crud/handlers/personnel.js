import { pool } from "../db/Connection.js";

// Allowed experience levels
const VALID_EXPERIENCE_LEVELS = ["Junior", "Mid-Level", "Senior"];

// CREATE personnel
export const createPersonnel = async (req, res) => {
  const { name, email, role, experience_level } = req.body;

  if (!name || !email || !experience_level) {
    return res
      .status(400)
      .json({ success: false, message: "name, email and experience_level are required" });
  }

  if (!VALID_EXPERIENCE_LEVELS.includes(experience_level)) {
    return res.status(400).json({
      success: false,
      message: `experience_level must be one of: ${VALID_EXPERIENCE_LEVELS.join(", ")}`,
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO personnel (name, email, role, experience_level)
       VALUES (?, ?, ?, ?)`,
      [name, email, role || null, experience_level]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        email,
        role: role || null,
        experience_level,
      },
    });
  } catch (error) {
    console.error("Error creating personnel:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A personnel with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET all personnel
export const getAllPersonnel = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, experience_level, created_at FROM personnel`
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching personnel:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET single personnel by id
export const getPersonnelById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, experience_level, created_at
       FROM personnel WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Personnel not found" });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching personnel by id:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// UPDATE personnel
export const updatePersonnel = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, experience_level } = req.body;

  if (experience_level && !VALID_EXPERIENCE_LEVELS.includes(experience_level)) {
    return res.status(400).json({
      success: false,
      message: `experience_level must be one of: ${VALID_EXPERIENCE_LEVELS.join(", ")}`,
    });
  }

  try {
    const [existing] = await pool.query(`SELECT * FROM personnel WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Personnel not found" });
    }

    const updated = {
      name: name ?? existing[0].name,
      email: email ?? existing[0].email,
      role: role ?? existing[0].role,
      experience_level: experience_level ?? existing[0].experience_level,
    };

    await pool.query(
      `UPDATE personnel
       SET name = ?, email = ?, role = ?, experience_level = ?
       WHERE id = ?`,
      [updated.name, updated.email, updated.role, updated.experience_level, id]
    );

    return res.status(200).json({
      success: true,
      data: { id: Number(id), ...updated },
    });
  } catch (error) {
    console.error("Error updating personnel:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A personnel with this email already exists",
      });
    }

    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE personnel
export const deletePersonnel = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM personnel WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Personnel not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Personnel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting personnel:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
