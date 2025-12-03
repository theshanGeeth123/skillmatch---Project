import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar3 from "../NavBar/NavBar3";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const PersonnelSkills = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const [personnel, setPersonnel] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [assignedSkills, setAssignedSkills] = useState([]);

  const [skillId, setSkillId] = useState("");
  const [proficiency, setProficiency] = useState("1");

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

  // Load personnel & skills once userId is known
  useEffect(() => {
    if (!userId) return;

    const loadAll = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([loadPersonnel(userId), loadSkills(userId)]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadPersonnel = async (uid) => {
    const effectiveUserId = uid || userId;
    if (!effectiveUserId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/personnel?userId=${effectiveUserId}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load personnel");
      setPersonnel(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load personnel");
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

  const loadAssignedSkills = async (personId) => {
    if (!userId || !personId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/personnel/${personId}/skills?userId=${userId}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load assigned skills");
      setAssignedSkills(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load assigned skills");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedPerson) return;

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
        `${API_BASE_URL}/personnel/${selectedPerson}/skills?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skill_id: skillId, proficiency }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to assign skill");

      setSuccess("Skill assigned successfully!");
      setSkillId("");
      setProficiency("1");

      loadAssignedSkills(selectedPerson);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to assign skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!selectedPerson) return;
    if (!window.confirm("Remove this skill from the person?")) return;

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/personnel/skills/${assignmentId}?userId=${userId}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to remove skill");

      setSuccess("Skill removed.");
      loadAssignedSkills(selectedPerson);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to remove skill");
    }
  };

  const proficiencyLevels = ["1", "2", "3", "4", "5"];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar3 />

      <main className="flex-1 px-4 pt-24 pb-20 md:px-10 lg:px-16">
        <h1 className="mb-4 text-2xl font-bold md:text-3xl">
          Assign Skills to Personnel
        </h1>
        <p className="mb-6 text-slate-400">
          Select a person, assign skills with proficiency levels, update, or
          remove them.
        </p>

        {/* Loading indicator */}
        {loading && (
          <p className="mb-4 text-sm text-slate-400">Loading data...</p>
        )}

        {/* Error & success messages */}
        {error && (
          <div className="px-4 py-2 mb-4 text-red-200 border border-red-600 rounded-lg bg-red-900/40">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-2 mb-4 border rounded-lg bg-emerald-900/40 border-emerald-600 text-emerald-200">
            {success}
          </div>
        )}

        {/* Person selector */}
        <div className="mb-8">
          <label className="block mb-2 text-sm text-slate-300">
            Select Personnel
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg md:w-80 bg-slate-900 border-slate-700"
            value={selectedPerson || ""}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedPerson(id || null);
              setAssignedSkills([]);
              setError("");
              setSuccess("");
              if (id) {
                loadAssignedSkills(id);
              }
            }}
          >
            <option value="">Choose a person...</option>
            {personnel.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.role || "No role"}
              </option>
            ))}
          </select>
        </div>

        {/* Only show skill assignment form if a person is selected */}
        {selectedPerson && (
          <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
            {/* Form */}
            <section className="p-5 border bg-slate-900/70 border-slate-800 rounded-2xl">
              <h2 className="mb-4 text-xl font-semibold">
                Assign Skill to Person
              </h2>

              <form className="space-y-4 text-sm" onSubmit={handleAssign}>
                <div>
                  <label className="block mb-1">Skill</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                  >
                    <option value="">Choose a skill...</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Proficiency</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-slate-950 border-slate-700"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                  >
                    {proficiencyLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Assigning..." : "Assign Skill"}
                </button>
              </form>
            </section>

            {/* Assigned skills list */}
            <section className="p-5 border bg-slate-900/70 border-slate-800 rounded-2xl">
              <h2 className="mb-4 text-xl font-semibold">Assigned Skills</h2>

              {assignedSkills.length === 0 ? (
                <p className="text-sm text-slate-400">
                  This person has no assigned skills.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="py-2 text-left">Skill</th>
                      <th className="py-2 text-left">Proficiency</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedSkills.map((a) => (
                      <tr
                        key={a.assignment_id}
                        className="border-b border-slate-800"
                      >
                        <td className="py-2">{a.skill_name}</td>
                        <td className="py-2">Level {a.proficiency}</td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => handleDelete(a.assignment_id)}
                            className="px-3 py-1 text-xs bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer1 />
    </div>
  );
};

export default PersonnelSkills;
