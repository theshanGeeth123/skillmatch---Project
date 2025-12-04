import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar3 from "../NavBar/NavBar3";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  name: "",
  category: "Programming Language",
  description: "",
};

const Skills = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  // Load skills for this user
  const loadSkills = async (uid) => {
    const effectiveUserId = uid || userId;
    if (!effectiveUserId) return;

    try {
      setLoadingList(true);
      setError("");

      const res = await fetch(
        `${API_BASE_URL}/skills?userId=${effectiveUserId}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load skills");
      }

      setSkills(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load skills");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadSkills(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/skills/${editingId}?userId=${userId}`
        : `${API_BASE_URL}/skills?userId=${userId}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save skill");
      }

      setSuccessMessage(
        editingId ? "Skill updated successfully." : "Skill created successfully."
      );
      setForm(emptyForm);
      setEditingId(null);
      loadSkills();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save skill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name || "",
      category: skill.category || "Programming Language",
      description: skill.description || "",
    });
    setEditingId(skill.id);
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
    const ok = window.confirm("Are you sure you want to delete this skill?");
    if (!ok) return;

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setError("");

      const res = await fetch(
        `${API_BASE_URL}/skills/${id}?userId=${userId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete skill");
      }

      setSuccessMessage("Skill deleted successfully.");
      loadSkills();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete skill");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar3 />

      <main className="flex-1 px-4 pt-24 pb-16 md:px-10 lg:px-16 lg:mx-20">
        <header className="flex flex-col gap-2 mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Skill Management</h1>
            <p className="max-w-2xl text-sm md:text-base text-slate-300">
              Manage your skill catalog and keep track of categories and
              descriptions for each skill.
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
              {editingId ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-slate-300" htmlFor="name">
                  Skill Name<span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. React, Python, Communication"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300" htmlFor="category">
                  Category<span className="text-red-400">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Programming Language">Programming Language</option>
                  <option value="Framework">Framework</option>
                  <option value="Tool">Tool</option>
                  <option value="Soft Skill">Soft Skill</option>
                </select>
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
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg resize-none bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional details about this skill..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? editingId
                      ? "Saving..."
                      : "Adding..."
                    : editingId
                    ? "Save Changes"
                    : "Add Skill"}
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
              <h2 className="text-lg font-semibold">Skills List</h2>
              {loadingList && (
                <span className="text-xs text-slate-400">Loading...</span>
              )}
            </div>

            {skills.length === 0 && !loadingList ? (
              <p className="text-sm text-slate-400">
                No skills found. Use the form on the left to add one.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead className="text-left border-b text-slate-400 border-slate-700/70">
                    <tr>
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Category</th>
                      <th className="py-2 pr-2">Description</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr
                        key={skill.id}
                        className="border-b border-slate-800/70 last:border-none"
                      >
                        <td className="py-2 pr-2">{skill.name}</td>
                        <td className="py-2 pr-2 text-slate-300">
                          {skill.category}
                        </td>
                        <td className="py-2 pr-2 text-slate-300">
                          {skill.description || "-"}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="px-3 py-1 mr-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
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

export default Skills;
