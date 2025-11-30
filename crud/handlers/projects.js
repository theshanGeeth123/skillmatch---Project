import { pool } from "../db/Connection.js";

const VALID_STATUSES = ["Planning", "Active", "Completed"];

export const createProject = async (req, res) => {
  const { name, description, start_date, end_date, status } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  // Optional: simple date validation if both given
  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({
      success: false,
      message: "start_date cannot be after end_date",
    });
  }

  try {
    const [result] = await pool.query(
      `
      INSERT INTO projects (name, description, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        description || null,
        start_date || null,
        end_date || null,
        status || "Planning",
      ]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        description: description || null,
        start_date: start_date || null,
        end_date: end_date || null,
        status: status || "Planning",
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT id, name, description, start_date, end_date, status, created_at
      FROM projects
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT id, name, description, start_date, end_date, status, created_at
      FROM projects
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, start_date, end_date, status } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({
      success: false,
      message: "start_date cannot be after end_date",
    });
  }

  try {
    const [existing] = await pool.query(
      `SELECT * FROM projects WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const current = existing[0];

    const updated = {
      name: name ?? current.name,
      description: description ?? current.description,
      start_date: start_date ?? current.start_date,
      end_date: end_date ?? current.end_date,
      status: status ?? current.status,
    };

    await pool.query(
      `
      UPDATE projects
      SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?
      WHERE id = ?
      `,
      [
        updated.name,
        updated.description,
        updated.start_date,
        updated.end_date,
        updated.status,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      data: { id: Number(id), ...updated },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM projects WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
