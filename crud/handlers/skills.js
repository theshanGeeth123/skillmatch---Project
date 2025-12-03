import { pool } from "../db/Connection.js";

const VALID_CATEGORIES = [
  "Programming Language",
  "Framework",
  "Tool",
  "Soft Skill",
];

// Helper to get userId from query and validate
const getUserIdFromRequest = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: "userId is required for this operation",
    });
    return null;
  }

  return Number(userId);
};

// CREATE skill (scoped to user)
export const createSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

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
      `
      INSERT INTO skills (user_id, name, category, description)
      VALUES (?, ?, ?, ?)
      `,
      [userId, name, category, description || null]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        user_id: userId,
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

// GET all skills for current user
export const getAllSkills = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  try {
    const [rows] = await pool.query(
      `
      SELECT id, user_id, name, category, description, created_at
      FROM skills
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
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

// GET skill by id (scoped to user)
export const getSkillById = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT id, user_id, name, category, description, created_at
      FROM skills
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
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

// UPDATE skill (scoped to user)
export const updateSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

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
      `SELECT * FROM skills WHERE id = ? AND user_id = ?`,
      [id, userId]
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
      `
      UPDATE skills
      SET name = ?, category = ?, description = ?
      WHERE id = ? AND user_id = ?
      `,
      [updated.name, updated.category, updated.description, id, userId]
    );

    return res.status(200).json({
      success: true,
      data: { id: Number(id), user_id: userId, ...updated },
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// DELETE skill (scoped to user)
export const deleteSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM skills WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

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
