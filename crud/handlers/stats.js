import { pool } from "../db/Connection.js";


//Returns how many personnel have each skill.

export const getSkillsDistribution = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
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
      `
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching skills distribution:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


 // Returns how many personnel are at each experience level (senior , junior ,Mid-Level):
 
export const getExperienceLevelStats = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        experience_level,
        COUNT(*) AS count
      FROM personnel
      GROUP BY experience_level
      ORDER BY 
        FIELD(experience_level, 'Junior', 'Mid-Level', 'Senior')
      `
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching experience level stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


// Returns how many projects are in each status:

export const getProjectStatusStats = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        status,
        COUNT(*) AS count
      FROM projects
      GROUP BY status
      ORDER BY 
        FIELD(status, 'Planning', 'Active', 'Completed')
      `
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching project status stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



// total required skills for the project
//  how many skills are covered by your personnel
//  coverage percentage
// details for each skill (covered or missing)

export const getProjectSkillCoverage = async (req, res) => {
  const { projectId } = req.params;

  try {
    const [requiredSkills] = await pool.query(
      `
      SELECT 
        prs.skill_id,
        prs.min_proficiency,
        s.name AS skill_name
      FROM project_required_skills prs
      JOIN skills s ON prs.skill_id = s.id
      WHERE prs.project_id = ?
      `,
      [projectId]
    );

    if (requiredSkills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "This project has no required skills"
      });
    }

    const coverageResults = await Promise.all(
      requiredSkills.map(async (reqSkill) => {
        const [rows] = await pool.query(
          `
          SELECT ps.personnel_id
          FROM personnel_skills ps
          WHERE ps.skill_id = ?
            AND ps.proficiency >= ?
          LIMIT 1
          `,
          [reqSkill.skill_id, reqSkill.min_proficiency]
        );

        return {
          skill_id: reqSkill.skill_id,
          skill_name: reqSkill.skill_name,
          min_proficiency: reqSkill.min_proficiency,
          covered: rows.length > 0
        };
      })
    );

    const totalRequired = coverageResults.length;
    const covered = coverageResults.filter(s => s.covered).length;
    const percentage = Math.round((covered / totalRequired) * 100);

    return res.status(200).json({
      success: true,
      data: {
        project_id: Number(projectId),
        total_required_skills: totalRequired,
        covered_skills: covered,
        coverage_percentage: percentage,
        skills: coverageResults
      }
    });
  } catch (error) {
    console.error("Error computing project skill coverage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
