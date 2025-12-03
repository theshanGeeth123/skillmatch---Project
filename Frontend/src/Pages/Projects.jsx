import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  status: "Planning",
};

const Projects = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check login + set userId
  useEffect(() => {
    const storedId = localStorage.getItem("sf_userId");
    if (!storedId) {
      navigate("/login");
    } else {
      setUserId(storedId);
    }
  }, [navigate]);

  // Load all projects for this user
  const loadProjects = async (uid) => {
    const effectiveUserId = uid || userId;
    if (!effectiveUserId) return;

    try {
      setLoadingList(true);
      setError("");

      const res = await fetch(
        `${API_BASE_URL}/projects?userId=${effectiveUserId}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load projects");
      }

      setProjects(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadProjects(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/projects/${editingId}?userId=${userId}`
        : `${API_BASE_URL}/projects?userId=${userId}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save project");
      }

      setSuccessMessage(
        editingId
          ? "Project updated successfully."
          : "Project created successfully."
      );
      setForm(emptyForm);
      setEditingId(null);
      loadProjects();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name || "",
      description: project.description || "",
      start_date: project.start_date
        ? project.start_date.substring(0, 10)
        : "",
      end_date: project.end_date ? project.end_date.substring(0, 10) : "",
      status: project.status || "Planning",
    });
    setEditingId(project.id);
    setError("");
    setSuccessMessage("");
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this project?");
    if (!ok) return;

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setError("");
      const res = await fetch(
        `${API_BASE_URL}/projects/${id}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete project");
      }

      setSuccessMessage("Project deleted successfully.");
      loadProjects();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-16 md:px-10 lg:px-16">
        <header className="flex flex-col gap-2 mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Project Management
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-slate-300">
              Create and manage projects, define timeframes, and track their
              status.
            </p>
          </div>
        </header>

        {/* Messages */}
        {error && (
          <div className="max-w-xl px-4 py-2 mb-4 text-sm text-red-100 border rounded-lg bg-red-900/40 border-red-500/50">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="max-w-xl px-4 py-2 mb-4 text-sm border rounded-lg bg-emerald-900/40 border-emerald-500/50 text-emerald-100">
            {successMessage}
          </div>
        )}

        {/* Form + list */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Form */}
          <section className="p-5 border shadow-lg bg-slate-900/80 border-slate-800 rounded-2xl">
            <h2 className="mb-3 text-lg font-semibold">
              {editingId ? "Edit Project" : "Add New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-slate-300" htmlFor="name">
                  Project Name<span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-slate-300"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the project"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-1 text-slate-300"
                    htmlFor="start_date"
                  >
                    Start Date
                  </label>
                  <input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 text-slate-300"
                    htmlFor="end_date"
                  >
                    End Date
                  </label>
                  <input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-300" htmlFor="status">
                  Status<span className="text-red-400">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving
                    ? editingId
                      ? "Saving..."
                      : "Creating..."
                    : editingId
                    ? "Save Changes"
                    : "Create Project"}
                </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm border rounded-xl border-slate-600 text-slate-200 hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
              </div>
            </form>
          </section>

          {/* List */}
          <section className="p-5 border shadow-lg bg-slate-900/80 border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Projects List</h2>
              {loadingList && (
                <span className="text-xs text-slate-400">Loading...</span>
              )}
            </div>

            {projects.length === 0 && !loadingList ? (
              <p className="text-sm text-slate-400">
                No projects found. Use the form to add one.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead className="text-left border-b text-slate-400 border-slate-700/70">
                    <tr>
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Status</th>
                      <th className="py-2 pr-2">Start</th>
                      <th className="py-2 pr-2">End</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-slate-800/70 last:border-none"
                      >
                        <td className="py-2 pr-2">{project.name}</td>
                        <td className="py-2 pr-2 text-slate-300">
                          {project.status}
                        </td>
                        <td className="py-2 pr-2 text-slate-400">
                          {project.start_date
                            ? project.start_date.substring(0, 10)
                            : "-"}
                        </td>
                        <td className="py-2 pr-2 text-slate-400">
                          {project.end_date
                            ? project.end_date.substring(0, 10)
                            : "-"}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => handleEdit(project)}
                            className="px-3 py-1 mr-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="px-3 py-1 text-xs bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default Projects;
