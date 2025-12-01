import express from "express";
import {createPersonnel,getAllPersonnel,getPersonnelById,updatePersonnel,deletePersonnel,} from "../handlers/personnel.js";

import {createSkill,getAllSkills,getSkillById,updateSkill,deleteSkill,} from "../handlers/skills.js";

import {assignSkillToPersonnel,getSkillsForPersonnel,updatePersonnelSkill,deletePersonnelSkill,} from "../handlers/personnelSkills.js";

import {createProject,getAllProjects,getProjectById,updateProject,deleteProject} from "../handlers/projects.js";

import {addRequiredSkillToProject,getRequiredSkillsForProject,updateProjectRequiredSkill,deleteProjectRequiredSkill,} from "../handlers/projectRequiredSkills.js";

import { getProjectMatches } from "../handlers/matching.js";

import { register, login } from "../handlers/auth.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

// chart 1

import { getSkillsDistribution,getExperienceLevelStats,getProjectStatusStats,getProjectSkillCoverage  } from "../handlers/stats.js";

// report

import { getSystemOverviewReport } from "../handlers/reports.js";



const router = express.Router();

// Health check
router.get("/test", (req, res) => {
  res.json({ status: "ok" });
});

//  PERSONNEL CRUD 
router.post("/personnel", createPersonnel);
router.get("/personnel", getAllPersonnel);
router.get("/personnel/:id", getPersonnelById);
router.put("/personnel/:id", updatePersonnel);
router.delete("/personnel/:id", deletePersonnel);

//  SKILLS CRUD  
router.post("/skills", createSkill);
router.get("/skills", getAllSkills);
router.get("/skills/:id", getSkillById);
router.put("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

//  PERSONNEL-SKILLS ASSIGNMENT 
router.post("/personnel/:personnelId/skills", assignSkillToPersonnel);
router.get("/personnel/:personnelId/skills", getSkillsForPersonnel);
router.put(
  "/personnel/:personnelId/skills/:skillId",
  updatePersonnelSkill
);
router.delete(
  "/personnel/:personnelId/skills/:skillId",
  deletePersonnelSkill
);

//  PROJECTS CRUD  
router.post("/projects", createProject);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

//  PROJECT REQUIRED SKILLS  
router.post(
  "/projects/:projectId/required-skills",
  addRequiredSkillToProject
);
router.get(
  "/projects/:projectId/required-skills",
  getRequiredSkillsForProject
);
router.put(
  "/projects/:projectId/required-skills/:skillId",
  updateProjectRequiredSkill
);
router.delete(
  "/projects/:projectId/required-skills/:skillId",
  deleteProjectRequiredSkill
);


//  Matching relvant personnel for project
router.get("/projects/:projectId/matches", getProjectMatches);

// For User
router.post("/auth/register", register);
router.post("/auth/login", login);


// charts 

router.get("/stats/skills-distribution", getSkillsDistribution);
router.get("/stats/experience-levels", getExperienceLevelStats);
router.get("/stats/project-status", getProjectStatusStats);
router.get("/projects/:projectId/skill-coverage", getProjectSkillCoverage);

// reports
router.get("/reports/overview", getSystemOverviewReport);


export default router;

