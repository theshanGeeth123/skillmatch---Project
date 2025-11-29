import express from "express";
import {
  createPersonnel,
  getAllPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel,
} from "../handlers/personnel.js";

import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../handlers/skills.js";

import {
  assignSkillToPersonnel,
  getSkillsForPersonnel,
  updatePersonnelSkill,
  deletePersonnelSkill,
} from "../handlers/personnelSkills.js";

const router = express.Router();

// Health check
router.get("/test", (req, res) => {
  res.json({ status: "Api work properly" });
});

/*  PERSONNEL CRUD  */
router.post("/personnel", createPersonnel);
router.get("/personnel", getAllPersonnel);
router.get("/personnel/:id", getPersonnelById);
router.put("/personnel/:id", updatePersonnel);
router.delete("/personnel/:id", deletePersonnel);

/*  SKILLS CRUD */
router.post("/skills", createSkill);
router.get("/skills", getAllSkills);
router.get("/skills/:id", getSkillById);
router.put("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

/* PERSONNEL-SKILLS ASSIGNMENT  */

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

export default router;
