import { pool } from "../db/Connection.js";

const VALID_CATEGORIES = [
  "Programming Language",
  "Framework",
  "Tool",
  "Soft Skill",
];

// CREATE skill
export const createSkill = async (req, res) => {
  const { name, category, description } = req.body;

  if (!name || !category) {
    return res.status(400).json({
      success: false,
      message: "name and category are required",
    });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO skills (name, category, description) VALUES (?, ?, ?)`,
      [name, category, description || null]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        category,
        description: description || null,
      },
    });
  } catch (error) {
    console.error("Error creating skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET all skills
export const getAllSkills = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, category, description, created_at FROM skills`
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET skill by id
export const getSkillById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, name, category, description, created_at FROM skills WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// UPDATE skill
export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  try {
    const [existing] = await pool.query(
      `SELECT * FROM skills WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    const updated = {
      name: name ?? existing[0].name,
      category: category ?? existing[0].category,
      description: description ?? existing[0].description,
    };

    await pool.query(
      `UPDATE skills SET name = ?, category = ?, description = ? WHERE id = ?`,
      [updated.name, updated.category, updated.description, id]
    );

    return res.status(200).json({
      success: true,
      data: { id: Number(id), ...updated },
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// DELETE skill
export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM skills WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
