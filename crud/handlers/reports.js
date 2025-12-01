import { pool } from "../db/Connection.js";

/**
 * GET /api/reports/overview
 *
 * Combines:
 *  - skill distribution
 *  - experience levels
 *  - project status stats
 *
 * (Frontend will use this to generate charts and PDF reports)
 */
export const getSystemOverviewReport = async (req, res) => {
  try {
    /** 1. Skill Distribution */
    const [skillsDistribution] = await pool.query(`
      SELECT 
        s.id AS skill_id,
        s.name AS skill_name,
        s.category,
        COUNT(ps.personnel_id) AS personnel_count
      FROM skills s
      LEFT JOIN personnel_skills ps
        ON s.id = ps.skill_id
      GROUP BY s.id, s.name, s.category
      ORDER BY personnel_count DESC, s.name ASC
    `);

    /** 2. Experience Level Stats */
    const [experienceStats] = await pool.query(`
      SELECT 
        experience_level,
        COUNT(*) AS count
      FROM personnel
      GROUP BY experience_level
      ORDER BY FIELD(experience_level, 'Junior', 'Mid-Level', 'Senior')
    `);

    /** 3. Project Status Stats */
    const [projectStatus] = await pool.query(`
      SELECT 
        status,
        COUNT(*) AS count
      FROM projects
      GROUP BY status
      ORDER BY FIELD(status, 'Planning', 'Active', 'Completed')
    `);

    /** Build final report */
    const report = {
      generated_at: new Date(),
      summary: {
        total_skills: skillsDistribution.length,
        total_personnel: experienceStats.reduce((sum, e) => sum + e.count, 0),
        total_projects: projectStatus.reduce((sum, p) => sum + p.count, 0),
      },
      skills_distribution: skillsDistribution,
      experience_levels: experienceStats,
      project_status: projectStatus,
    };

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating system report:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
