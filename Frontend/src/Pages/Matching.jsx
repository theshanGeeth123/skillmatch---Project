import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar3";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const Matching = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [matches, setMatches] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // On mount: check session
  useEffect(() => {
    const storedId = localStorage.getItem("sf_userId");
    if (!storedId) {
      navigate("/login");
    } else {
      setUserId(storedId);
    }
  }, [navigate]);

  // Load projects once we know userId
  useEffect(() => {
    if (!userId) return;

    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        setError("");

        const res = await fetch(
          `${API_BASE_URL}/projects?userId=${userId}`
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
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [userId]);

  const runMatching = async () => {
    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setError("");
    setInfo("");
    setLoadingMatches(true);
    setMatches([]);

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/${selectedProject}/matches?userId=${userId}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to run matching");
      }

      const result = data.data || [];
      setMatches(result);

      if (result.length === 0) {
        setInfo("No personnel meet all required skills for this project yet.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to run matching");
    } finally {
      setLoadingMatches(false);
    }
  };

  // Use backend's match_percentage
  const formatScore = (percentage) => {
    if (percentage === null || percentage === undefined) return "-";
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-20 md:px-10 lg:px-16 lg:mx-20">
        <h1 className="mb-3 text-2xl font-bold md:text-3xl">
          Skill Matching
        </h1>
        <p className="max-w-2xl mb-6 text-sm text-slate-300 md:text-base">
          Choose a project to find personnel who match all required skills,
          filtered by minimum proficiency.
        </p>

        {/* Messages */}
        {error && (
          <div className="px-4 py-2 mb-4 text-sm text-red-100 border border-red-600 rounded-lg bg-red-900/40">
            {error}
          </div>
        )}
        {info && (
          <div className="px-4 py-2 mb-4 text-sm border rounded-lg bg-slate-900/60 border-slate-700 text-slate-200">
            {info}
          </div>
        )}

        {/* Project selector + button */}
        <section className="flex flex-col gap-4 p-5 mb-8 border bg-slate-900/70 border-slate-800 rounded-2xl md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block mb-1 text-sm text-slate-300">
              Select Project
            </label>
            <select
              className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-950 border-slate-700"
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setMatches([]);
                setInfo("");
                setError("");
              }}
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? "Loading projects..." : "Choose a project..."}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.status}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runMatching}
            disabled={loadingMatches || !selectedProject}
            className="px-5 py-2 text-sm font-semibold bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingMatches ? "Running..." : "Run Matching"}
          </button>
        </section>

        {/* Results */}
        <section className="p-5 border bg-slate-900/70 border-slate-800 rounded-2xl">
          <h2 className="mb-4 text-lg font-semibold">
            Matching Results
          </h2>

          {!selectedProject && (
            <p className="text-sm text-slate-400">
              Select a project and click &quot;Run Matching&quot; to see results.
            </p>
          )}

          {selectedProject && !loadingMatches && matches.length === 0 && !info && (
            <p className="text-sm text-slate-400">
              No results yet. Click &quot;Run Matching&quot;.
            </p>
          )}

          {loadingMatches && (
            <p className="text-sm text-slate-400">Running matching...</p>
          )}

          {matches.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="py-2 text-left">Person</th>
                    <th className="py-2 text-left">Role / Level</th>
                    <th className="py-2 text-left">Matched Skills</th>
                    <th className="py-2 text-right">Match Score</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m) => (
                    <tr
                      key={m.personnel_id}
                      className="align-top border-b border-slate-800 last:border-none"
                    >
                      {/* Person */}
                      <td className="py-2 pr-3">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">
                          {m.email}
                        </div>
                      </td>

                      {/* Role + experience */}
                      <td className="py-2 pr-3 text-slate-300">
                        <div>{m.role || "-"}</div>
                        <div className="text-xs text-slate-400">
                          {m.experience_level}
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="py-2 pr-3 text-slate-200">
                        {m.matched_skills && m.matched_skills.length > 0 ? (
                          <ul className="space-y-1">
                            {m.matched_skills.map((s) => (
                              <li
                                key={s.skill_id}
                                className="text-xs md:text-[13px]"
                              >
                                <span className="font-medium">
                                  {s.skill_name}
                                </span>{" "}
                                — required L{s.required_min}, person L
                                {s.proficiency}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-slate-500">
                            No skills details provided.
                          </span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="py-2 font-semibold text-right">
                        {formatScore(m.match_percentage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer1 />
    </div>
  );
};

export default Matching;
