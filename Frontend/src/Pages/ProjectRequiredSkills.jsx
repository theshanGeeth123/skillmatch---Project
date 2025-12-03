import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const ProjectRequiredSkills = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [requiredSkills, setRequiredSkills] = useState([]);

  const [skillId, setSkillId] = useState("");
  const [minProficiency, setMinProficiency] = useState("1");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check session & set userId
  useEffect(() => {
    const storedId = localStorage.getItem("sf_userId");
    if (!storedId) {
      navigate("/login");
    } else {
      setUserId(storedId);
    }
  }, [navigate]);

  // Load projects and skills once userId is known
  useEffect(() => {
    if (!userId) return;

    const loadAll = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([loadProjects(userId), loadSkills(userId)]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadProjects = async (uid) => {
    const effectiveUserId = uid || userId;
    if (!effectiveUserId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects?userId=${effectiveUserId}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load projects");
      setProjects(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load projects");
    }
  };

  const loadSkills = async (uid) => {
    const effectiveUserId = uid || userId;
    if (!effectiveUserId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/skills?userId=${effectiveUserId}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load skills");
      setSkills(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load skills");
    }
  };

  const loadRequiredSkills = async (projectId) => {
    if (!userId || !projectId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/${projectId}/required-skills?userId=${userId}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load required skills");
      setRequiredSkills(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load required skills");
    }
  };

  // Assign a required skill
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/${selectedProject}/required-skills?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skill_id: skillId,
            min_proficiency: minProficiency,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to add required skill");

      setSuccess("Required skill added!");
      setSkillId("");
      setMinProficiency("1");
      loadRequiredSkills(selectedProject);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add required skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skillIdToRemove) => {
    const ok = window.confirm("Remove this required skill?");
    if (!ok) return;

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/${selectedProject}/required-skills/${skillIdToRemove}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to remove required skill");

      setSuccess("Required skill removed.");
      loadRequiredSkills(selectedProject);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to remove required skill");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-20 md:px-10 lg:px-16">
        <h1 className="mb-4 text-3xl font-bold">Project Required Skills</h1>
        <p className="mb-6 text-slate-400">
          Choose a project and define which skills are required, including minimum proficiency levels.
        </p>

        {loading && (
          <p className="mb-4 text-sm text-slate-400">Loading projects and skills...</p>
        )}

        {/* Error / success messages */}
        {error && (
          <div className="px-4 py-2 mb-3 text-sm text-red-200 border border-red-600 rounded-lg bg-red-900/40">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-2 mb-3 text-sm border rounded-lg bg-emerald-900/40 border-emerald-600 text-emerald-200">
            {success}
          </div>
        )}

        {/* Project Selector */}
        <div className="mb-8">
          <label className="block mb-1 text-sm text-slate-300">
            Select Project
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg md:w-96 bg-slate-900 border-slate-700"
            value={selectedProject || ""}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedProject(id || null);
              setRequiredSkills([]);
              setError("");
              setSuccess("");
              if (id) loadRequiredSkills(id);
            }}
          >
            <option value="">Choose a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.status}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
            {/* Assign Skill */}
            <section className="p-5 border bg-slate-900/60 border-slate-800 rounded-2xl">
              <h2 className="mb-4 text-xl font-semibold">Add Required Skill</h2>

              <form onSubmit={handleAssign} className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1">Skill</label>
                  <select
                    required
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                  >
                    <option value="">Select skill...</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Minimum Proficiency</label>
                  <select
                    value={minProficiency}
                    onChange={(e) => setMinProficiency(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                  >
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                    <option value="5">Level 5</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Adding..." : "Add Skill"}
                </button>
              </form>
            </section>

            {/* Required Skills Table */}
            <section className="p-5 border bg-slate-900/60 border-slate-800 rounded-2xl">
              <h2 className="mb-4 text-xl font-semibold">Required Skills</h2>

              {requiredSkills.length === 0 ? (
                <p className="text-slate-400">No required skills yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700 text-slate-400">
                      <tr>
                        <th className="py-2 text-left">Skill</th>
                        <th className="py-2 text-left">Min Level</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredSkills.map((rs) => (
                        <tr
                          key={rs.skill_id}
                          className="border-b border-slate-800"
                        >
                          <td className="py-2">{rs.skill_name}</td>
                          <td className="py-2">Level {rs.min_proficiency}</td>
                          <td className="py-2 text-right">
                            <button
                              className="px-3 py-1 text-xs bg-red-600 rounded-lg hover:bg-red-700"
                              onClick={() => handleDelete(rs.skill_id)}
                            >
                              Remove
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
        )}
      </main>

      <Footer1 />
    </div>
  );
};

export default ProjectRequiredSkills;
