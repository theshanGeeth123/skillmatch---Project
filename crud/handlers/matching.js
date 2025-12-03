import { pool } from "../db/Connection.js";

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

export const getProjectMatches = async (req, res) => {
  const userId = getUserIdFromRequest(req, res);
  if (!userId) return;

  const { projectId } = req.params;

  try {
    // 1) Ensure project belongs to this user
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

    // 2) Get required skills for this project
    const [requiredSkills] = await pool.query(
      `
      SELECT prs.skill_id, prs.min_proficiency, s.name AS skill_name
      FROM project_required_skills prs
      JOIN skills s ON prs.skill_id = s.id
      WHERE prs.project_id = ?
      `,
      [projectId]
    );

    if (requiredSkills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "This project has no required skills",
      });
    }

    // 3) Find personnel who have those skills with enough proficiency
    const [matchingPersonnel] = await pool.query(
      `
      SELECT 
        p.id AS personnel_id,
        p.name AS personnel_name,
        p.email,
        p.role,
        p.experience_level,
        ps.skill_id,
        ps.proficiency,
        s.name AS skill_name
      FROM personnel p
      JOIN personnel_skills ps ON p.id = ps.personnel_id
      JOIN skills s ON ps.skill_id = s.id
      JOIN project_required_skills prs
        ON prs.skill_id = ps.skill_id
       AND prs.project_id = ?
      WHERE 
        ps.proficiency >= prs.min_proficiency
        AND p.user_id = ?
      ORDER BY p.id;
      `,
      [projectId, userId]
    );

    if (matchingPersonnel.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No personnel meet the required skill levels for this project",
      });
    }

    // 4) Group by personnel, attach matched skills
    const personnelMap = new Map();

    matchingPersonnel.forEach((row) => {
      if (!personnelMap.has(row.personnel_id)) {
        personnelMap.set(row.personnel_id, {
          personnel_id: row.personnel_id,
          name: row.personnel_name,
          email: row.email,
          role: row.role,
          experience_level: row.experience_level,
          matched_skills: [],
          match_count: 0,
          total_required_skills: requiredSkills.length,
        });
      }

      const required = requiredSkills.find(
        (rs) => rs.skill_id === row.skill_id
      );

      personnelMap.get(row.personnel_id).matched_skills.push({
        skill_id: row.skill_id,
        skill_name: row.skill_name,
        person_level: row.proficiency,
        required_level: required ? required.min_proficiency : null,
      });

      personnelMap.get(row.personnel_id).match_count++;
    });

    // 5) Only personnel who matched ALL required skills
    const fullyMatchedPersonnel = [...personnelMap.values()].filter(
      (person) => person.match_count === person.total_required_skills
    );

    // 6) Add match_score (%) for frontend
    fullyMatchedPersonnel.forEach((person) => {
      person.match_score = Math.round(
        (person.match_count / person.total_required_skills) * 100
      );
    });

    return res.status(200).json({
      success: true,
      data: fullyMatchedPersonnel,
    });
  } catch (error) {
    console.error("Matching error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
