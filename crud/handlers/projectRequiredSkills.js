import { pool } from "../db/Connection.js";

const MIN_PROF = 1;
const MAX_PROF = 5;

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

// ADD or UPDATE required skill for project (user-scoped)
export const addRequiredSkillToProject = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { projectId } = req.params;
  const { skill_id, min_proficiency } = req.body;

  if (!skill_id || min_proficiency === undefined) {
    return res.status(400).json({
      success: false,
      message: "skill_id and min_proficiency are required",
    });
  }

  if (!isValidProficiency(min_proficiency)) {
    return res.status(400).json({
      success: false,
      message: `min_proficiency must be an integer between ${MIN_PROF} and ${MAX_PROF}`,
    });
  }

  try {
    // Check project exists AND belongs to current user
    const [projectRows] = await pool.query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    );
    if (projectRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found or does not belong to this user",
      });
    }

    // Check skill exists AND belongs to current user
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

    // Try insert
    try {
      const [result] = await pool.query(
        `
        INSERT INTO project_required_skills (project_id, skill_id, min_proficiency)
        VALUES (?, ?, ?)
        `,
        [projectId, skill_id, min_proficiency]
      );

      return res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          project_id: Number(projectId),
          skill_id,
          min_proficiency: Number(min_proficiency),
        },
      });
    } catch (error) {
      // If duplicate, update instead
      if (error.code === "ER_DUP_ENTRY") {
        await pool.query(
          `
          UPDATE project_required_skills
          SET min_proficiency = ?
          WHERE project_id = ? AND skill_id = ?
          `,
          [min_proficiency, projectId, skill_id]
        );

        return res.status(200).json({
          success: true,
          message: "Existing project required skill updated",
          data: {
            project_id: Number(projectId),
            skill_id,
            min_proficiency: Number(min_proficiency),
          },
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Error adding required skill to project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET required skills for a project (only if project belongs to user)
export const getRequiredSkillsForProject = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { projectId } = req.params;

  try {
    // Ensure project belongs to user
    const [projectRows] = await pool.query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    );
    if (projectRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found or does not belong to this user",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        prs.skill_id,
        s.name AS skill_name,
        s.category,
        prs.min_proficiency,
        prs.created_at
      FROM project_required_skills prs
      JOIN skills s ON prs.skill_id = s.id
      WHERE prs.project_id = ?
      `,
      [projectId]
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error getting required skills for project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// UPDATE required skill min proficiency (user-scoped)
export const updateProjectRequiredSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { projectId, skillId } = req.params;
  const { min_proficiency } = req.body;

  if (!isValidProficiency(min_proficiency)) {
    return res.status(400).json({
      success: false,
      message: `min_proficiency must be an integer between ${MIN_PROF} and ${MAX_PROF}`,
    });
  }

  try {
    // Ensure project belongs to user
    const [projectRows] = await pool.query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    );
    if (projectRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found or does not belong to this user",
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
      UPDATE project_required_skills
      SET min_proficiency = ?
      WHERE project_id = ? AND skill_id = ?
      `,
      [min_proficiency, projectId, skillId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project required skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        project_id: Number(projectId),
        skill_id: Number(skillId),
        min_proficiency: Number(min_proficiency),
      },
    });
  } catch (error) {
    console.error("Error updating project required skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// DELETE required skill (user-scoped)
export const deleteProjectRequiredSkill = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { projectId, skillId } = req.params;

  try {
    // Ensure project belongs to user
    const [projectRows] = await pool.query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    );
    if (projectRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found or does not belong to this user",
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
      DELETE FROM project_required_skills
      WHERE project_id = ? AND skill_id = ?
      `,
      [projectId, skillId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project required skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project required skill deleted",
    });
  } catch (error) {
    console.error("Error deleting project required skill:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
