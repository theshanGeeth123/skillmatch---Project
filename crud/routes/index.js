import express from "express";
import {
  createPersonnel,
  getAllPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel,
} from "../handlers/personnel.js";

const router = express.Router();

// Simple health check
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Personnel CRUD routes
router.post("/personnel", createPersonnel);       // Create
router.get("/personnel", getAllPersonnel);        // Read all
router.get("/personnel/:id", getPersonnelById);   // Read one
router.put("/personnel/:id", updatePersonnel);    // Update
router.delete("/personnel/:id", deletePersonnel); // Delete

export default router;
