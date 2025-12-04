import { pool } from "../db/Connection.js";


export const getSystemOverviewReport = async (req, res) => {
  const rawUserId = req.query.userId;
  const userId = parseInt(rawUserId, 10);

  if (!userId || Number.isNaN(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required" });
  }

  try {
    const [skillsDistribution] = await pool.query(
      `
      SELECT 
        s.id AS skill_id,
        s.name AS skill_name,
        s.category,
        COUNT(ps.personnel_id) AS personnel_count
      FROM skills s
      LEFT JOIN personnel_skills ps
        ON s.id = ps.skill_id
      LEFT JOIN personnel p
        ON ps.personnel_id = p.id
       AND p.user_id = ?
      WHERE s.user_id = ?
      GROUP BY s.id, s.name, s.category
      ORDER BY personnel_count DESC, s.name ASC
      `,
      [userId, userId]
    );

    const [experienceStats] = await pool.query(
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

    const [projectStatus] = await pool.query(
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

    const totalPersonnel = experienceStats.reduce(
      (sum, e) => sum + Number(e.count),
      0
    );
    const totalProjects = projectStatus.reduce(
      (sum, p) => sum + Number(p.count),
      0
    );

    const report = {
      generated_at: new Date().toISOString(),
      summary: {
        total_skills: skillsDistribution.length,
        total_personnel: totalPersonnel,
        total_projects: totalProjects,
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
