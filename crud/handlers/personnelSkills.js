import { pool } from "../db/Connection.js";

const MIN_PROF = 1;
const MAX_PROF = 5;

// Helper to validate proficiency
const isValidProficiency = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= MIN_PROF && num <= MAX_PROF;
};

// ASSIGN a skill to a personnel
export const assignSkillToPersonnel = async (req, res) => {
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
      message: `proficiency must be an integer between ${MIN_PROF} and ${MAX_PROF}`,
    });
  }

  try {
    // Check personnel exists
    const [personnelRows] = await pool.query(
      `SELECT id FROM personnel WHERE id = ?`,
      [personnelId]
    );
    if (personnelRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Personnel not found" });
    }

    // Check skill exists
    const [skillRows] = await pool.query(`SELECT id FROM skills WHERE id = ?`, [
      skill_id,
    ]);
    if (skillRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    // Insert or update (upsert-like behavior)
    // First try insert
    try {
      const [result] = await pool.query(
        `INSERT INTO personnel_skills (personnel_id, skill_id, proficiency)
         VALUES (?, ?, ?)`,
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
      // If duplicate (already has this skill), then update proficiency
      if (error.code === "ER_DUP_ENTRY") {
        await pool.query(
          `UPDATE personnel_skills
           SET proficiency = ?
           WHERE personnel_id = ? AND skill_id = ?`,
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET all skills of a personnel
export const getSkillsForPersonnel = async (req, res) => {
  const { personnelId } = req.params;

  try {
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

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error getting skills for personnel:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// UPDATE proficiency for a given personnel + skill
export const updatePersonnelSkill = async (req, res) => {
  const { personnelId, skillId } = req.params;
  const { proficiency } = req.body;

  if (!isValidProficiency(proficiency)) {
    return res.status(400).json({
      success: false,
      message: `proficiency must be an integer between ${MIN_PROF} and ${MAX_PROF}`,
    });
  }

  try {
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// DELETE assignment
export const deletePersonnelSkill = async (req, res) => {
  const { personnelId, skillId } = req.params;

  try {
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
