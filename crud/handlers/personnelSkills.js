import { pool } from "../db/Connection.js";

const MIN_PROF = 1;
const MAX_PROF = 5;

// Validate proficiency
const isValidProficiency = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= MIN_PROF && num <= MAX_PROF;
};

// Helper: get userId from query
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

// ASSIGN skill to personnel (user-scoped)
export const assignSkillToPersonnel = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { personnelId } = req.params;
  const { skill_id, proficiency } = req.body;

  if (!skill_id || proficiency === undefined) {
    return res.status(400).json({
      success: false,
      message: "skill_id and proficiency are required",
    });
  }

  if (!isValidProficiency(proficiency)) {
    return res.status(400).json({
      success: false,
      message: `proficiency must be between ${MIN_PROF} and ${MAX_PROF}`,
    });
  }

  try {
    // Ensure personnel belongs to user
    const [personnelRows] = await pool.query(
      `SELECT id FROM personnel WHERE id = ? AND user_id = ?`,
      [personnelId, userId]
    );
    if (personnelRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Personnel not found or does not belong to this user",
      });
    }

    // Ensure skill belongs to user
    const [skillRows] = await pool.query(
      `SELECT id FROM skills WHERE id = ? AND user_id = ?`,
      [skill_id, userId]
    );
    if (skillRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or does not belong to this user",
      });
    }

    // Try insert (if duplicate, update instead)
    try {
      const [result] = await pool.query(
        `
        INSERT INTO personnel_skills (personnel_id, skill_id, proficiency)
        VALUES (?, ?, ?)
        `,
        [personnelId, skill_id, proficiency]
      );

      return res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          personnel_id: Number(personnelId),
          skill_id,
          proficiency: Number(proficiency),
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        await pool.query(
          `
          UPDATE personnel_skills
          SET proficiency = ?
          WHERE personnel_id = ? AND skill_id = ?
          `,
          [proficiency, personnelId, skill_id]
        );

        return res.status(200).json({
          success: true,
          message: "Existing skill assignment updated",
          data: {
            personnel_id: Number(personnelId),
            skill_id,
            proficiency: Number(proficiency),
          },
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Error assigning skill to personnel:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET skills of personnel (only user's personnel)
export const getSkillsForPersonnel = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { personnelId } = req.params;

  try {
    // Ensure personnel belongs to user
    const [personnelRows] = await pool.query(
      `SELECT id FROM personnel WHERE id = ? AND user_id = ?`,
      [personnelId, userId]
    );
    if (personnelRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Personnel not found or does not belong to this user",
      });
    }

    // Fetch assigned skills
    const [rows] = await pool.query(
      `
      SELECT 
        ps.skill_id,
        s.name AS skill_name,
        s.category,
        ps.proficiency,
        ps.created_at
      FROM personnel_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.personnel_id = ?
      `,
      [personnelId]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error getting skills for personnel:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE proficiency (user-scoped)
export const updatePersonnelSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { personnelId, skillId } = req.params;
  const { proficiency } = req.body;

  if (!isValidProficiency(proficiency)) {
    return res.status(400).json({
      success: false,
      message: `proficiency must be between ${MIN_PROF} and ${MAX_PROF}`,
    });
  }

  try {
    // Ensure personnel belongs to user
    const [personnelRows] = await pool.query(
      `SELECT id FROM personnel WHERE id = ? AND user_id = ?`,
      [personnelId, userId]
    );
    if (personnelRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Personnel not found or does not belong to this user",
      });
    }

    // Ensure skill belongs to user
    const [skillRows] = await pool.query(
      `SELECT id FROM skills WHERE id = ? AND user_id = ?`,
      [skillId, userId]
    );
    if (skillRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or does not belong to this user",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE personnel_skills
      SET proficiency = ?
      WHERE personnel_id = ? AND skill_id = ?
      `,
      [proficiency, personnelId, skillId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Personnel-skill assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        personnel_id: Number(personnelId),
        skill_id: Number(skillId),
        proficiency: Number(proficiency),
      },
    });
  } catch (error) {
    console.error("Error updating personnel skill:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE skill assignment (user-scoped)
export const deletePersonnelSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { personnelId, skillId } = req.params;

  try {
    // Ensure personnel belongs to user
    const [personnelRows] = await pool.query(
      `SELECT id FROM personnel WHERE id = ? AND user_id = ?`,
      [personnelId, userId]
    );
    if (personnelRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Personnel not found or does not belong to this user",
      });
    }

    // Ensure skill belongs to user
    const [skillRows] = await pool.query(
      `SELECT id FROM skills WHERE id = ? AND user_id = ?`,
      [skillId, userId]
    );
    if (skillRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or does not belong to this user",
      });
    }

    const [result] = await pool.query(
      `
      DELETE FROM personnel_skills
      WHERE personnel_id = ? AND skill_id = ?
      `,
      [personnelId, skillId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Personnel-skill assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Personnel-skill assignment deleted",
    });
  } catch (error) {
    console.error("Error deleting personnel skill:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
