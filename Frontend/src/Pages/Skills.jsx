import React, { useEffect, useState } from "react";
import NavBar3 from "../NavBar/NavBar3";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  name: "",
  category: "",
  description: "",
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load all skills
  const loadSkills = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/skills`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load skills");
      }

      setSkills(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Form change handler
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create / Update skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/skills/${editingId}`
        : `${API_BASE_URL}/skills`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save skill");
      }

      setSuccessMessage(
        editingId ? "Skill updated successfully!" : "Skill added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      loadSkills();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit button
  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      description: skill.description || "",
    });
    setError("");
    setSuccessMessage("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // Delete skill
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setSuccessMessage("Skill deleted successfully.");
      loadSkills();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar3 />

      <main className="flex-1 px-4 pt-24 pb-16 md:px-10 lg:px-16">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Skill Management</h1>

        <p className="mb-6 text-slate-300">
          Manage your skills catalog. Add, edit, and remove skills.
        </p>

        {/* Alerts */}
        {error && (
          <div className="px-4 py-2 mb-4 text-red-200 border border-red-600 rounded-lg bg-red-900/40">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="px-4 py-2 mb-4 border rounded-lg bg-emerald-900/40 border-emerald-600 text-emerald-200">
            {successMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[1.5fr_2fr] gap-10">
          {/* FORM SECTION */}
          <section className="p-5 border bg-slate-900/70 border-slate-800 rounded-2xl">
            <h2 className="mb-4 text-xl font-semibold">
              {editingId ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1">Skill Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                  placeholder="React, AWS, Python..."
                />
              </div>

              {/* CATEGORY DROPDOWN */}
              <div>
                <label className="block mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                >
                  <option value="">Select category</option>
                  <option value="Programming Language">Programming Language</option>
                  <option value="Framework">Framework</option>
                  <option value="Tool">Tool</option>
                  <option value="Soft Skill">Soft Skill</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Skill"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border rounded-xl border-slate-600 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* SKILLS LIST */}
          <section className="p-5 border bg-slate-900/70 border-slate-800 rounded-2xl">
            <h2 className="mb-4 text-xl font-semibold">Skills List</h2>

            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : skills.length === 0 ? (
              <p className="text-slate-400">No skills added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="py-2 text-left">Skill</th>
                      <th className="py-2 text-left">Category</th>
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((s) => (
                      <tr key={s.id} className="border-b border-slate-800">
                        <td className="py-2">{s.name}</td>
                        <td className="py-2 text-slate-300">{s.category}</td>
                        <td className="py-2 text-slate-400">
                          {s.description || "-"}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => handleEdit(s)}
                            className="px-3 py-1 mr-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
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
