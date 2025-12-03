import React, { useEffect, useState } from "react";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const Matching = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [matches, setMatches] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Load projects once
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const res = await fetch(`${API_BASE_URL}/projects`);
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
  }, []);

  const runMatching = async () => {
    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }

    setError("");
    setInfo("");
    setLoadingMatches(true);

    try {
      // ⚠ If your backend path is different, update this URL
      const res = await fetch(
        `${API_BASE_URL}/projects/${selectedProject}/matches`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to run matching");
      }

      setMatches(data.data || []);
      if ((data.data || []).length === 0) {
        setInfo("No matching personnel found for this project yet.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to run matching");
    } finally {
      setLoadingMatches(false);
    }
  };

  // Helper to render match score nicely if backend sends it
  const formatScore = (score) => {
    if (score === null || score === undefined) return "-";
    return `${Math.round(score)}%`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-20 md:px-10 lg:px-16">
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
                      <td className="py-2 pr-3">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">
                          {m.email}
                        </div>
                      </td>

                      <td className="py-2 pr-3 text-slate-300">
                        <div>{m.role || "-"}</div>
                        <div className="text-xs text-slate-400">
                          {m.experience_level}
                        </div>
                      </td>

                      <td className="py-2 pr-3 text-slate-200">
                        {m.matched_skills && m.matched_skills.length > 0 ? (
                          <ul className="space-y-1">
                            {m.matched_skills.map((s) => (
                              <li key={s.skill_id} className="text-xs md:text-[13px]">
                                <span className="font-medium">{s.skill_name}</span>{" "}
                                — required L{s.required_level}, person L
                                {s.person_level}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-slate-500">
                            No skills details provided.
                          </span>
                        )}
                      </td>

                      <td className="py-2 font-semibold text-right">
                        {formatScore(m.match_score)}
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
