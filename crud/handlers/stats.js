import { pool } from "../db/Connection.js";

const getUserIdFromQuery = (req) => {
  const raw = req.query.userId;
  const userId = parseInt(raw, 10);
  if (!userId || Number.isNaN(userId)) return null;
  return userId;
};

export const getSkillsDistribution = async (req, res) => {
  const userId = getUserIdFromQuery(req);
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        s.id AS skill_id,
        s.name AS skill_name,
        s.category,
        COUNT(DISTINCT ps.personnel_id) AS personnel_count
      FROM skills s
      LEFT JOIN personnel_skills ps
        ON s.id = ps.skill_id
      LEFT JOIN personnel p
        ON ps.personnel_id = p.id
      WHERE s.user_id = ?
        AND (p.user_id = ? OR p.user_id IS NULL)
      GROUP BY s.id, s.name, s.category
      ORDER BY personnel_count DESC, s.name ASC
      `,
      [userId, userId]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching skills distribution:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getExperienceLevelStats = async (req, res) => {
  const userId = getUserIdFromQuery(req);
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        experience_level,
        COUNT(*) AS count
      FROM personnel
      WHERE user_id = ?
      GROUP BY experience_level
      ORDER BY FIELD(experience_level, 'Junior', 'Mid-Level', 'Senior')
      `,
      [userId]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching experience level stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getProjectStatusStats = async (req, res) => {
  const userId = getUserIdFromQuery(req);
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        status,
        COUNT(*) AS count
      FROM projects
      WHERE user_id = ?
      GROUP BY status
      ORDER BY FIELD(status, 'Planning', 'Active', 'Completed')
      `,
      [userId]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching project status stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



export const getProjectSkillCoverage = async (req, res) => {
  const { projectId } = req.params;

  const rawUserId = req.query.userId;
  const userId = parseInt(rawUserId, 10);
  if (!userId || Number.isNaN(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required" });
  }

  try {
    // 1) Ensure the project belongs to this user
    const [projectRows] = await pool.query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    );
    if (projectRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found for this user" });
    }

    // 2) Get required skills for that project
    const [requiredSkills] = await pool.query(
      `
      SELECT 
        prs.skill_id,
        prs.min_proficiency,
        s.name AS skill_name
      FROM project_required_skills prs
      JOIN skills s 
        ON prs.skill_id = s.id
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

    const coverageResults = await Promise.all(
      requiredSkills.map(async (reqSkill) => {
        const [rows] = await pool.query(
          `
          SELECT ps.personnel_id
          FROM personnel_skills ps
          JOIN personnel p
            ON ps.personnel_id = p.id
          WHERE p.user_id = ?
            AND ps.skill_id = ?
            AND ps.proficiency >= ?
          LIMIT 1
          `,
          [userId, reqSkill.skill_id, reqSkill.min_proficiency]
        );

        return {
          skill_id: reqSkill.skill_id,
          skill_name: reqSkill.skill_name,
          min_proficiency: reqSkill.min_proficiency,
          covered: rows.length > 0,
        };
      })
    );

    const totalRequired = coverageResults.length;
    const covered = coverageResults.filter((s) => s.covered).length;
    const percentage = Math.round((covered / totalRequired) * 100);

    return res.status(200).json({
      success: true,
      data: {
        project_id: Number(projectId),
        total_required_skills: totalRequired,
        covered_skills: covered,
        coverage_percentage: percentage,
        skills: coverageResults,
      },
    });
  } catch (error) {
    console.error("Error computing project skill coverage:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

