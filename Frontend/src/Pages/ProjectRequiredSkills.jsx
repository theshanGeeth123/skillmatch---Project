import React, { useEffect, useState } from "react";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const ProjectRequiredSkills = () => {
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

  // Load projects and skills
  useEffect(() => {
    loadProjects();
    loadSkills();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setProjects(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadSkills = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/skills`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSkills(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRequiredSkills = async (projectId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/${projectId}/required-skills`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setRequiredSkills(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Assign a required skill
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/${selectedProject}/required-skills`,
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
      if (!data.success) throw new Error(data.message);

      setSuccess("Required skill added!");
      setSkillId("");
      setMinProficiency("1");
      loadRequiredSkills(selectedProject);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skillId) => {
  const ok = window.confirm("Remove this required skill?");
  if (!ok) return;

  try {
    const res = await fetch(
      `${API_BASE_URL}/projects/${selectedProject}/required-skills/${skillId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    setSuccess("Required skill removed.");
    loadRequiredSkills(selectedProject);
  } catch (err) {
    setError(err.message);
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
              setSelectedProject(id);
              if (id) loadRequiredSkills(id);
              setRequiredSkills([]);
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
          <div className="grid lg:grid-cols-[1.4fr_2fr] gap-10">
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
                  className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
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
                          key={rs.id}
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
