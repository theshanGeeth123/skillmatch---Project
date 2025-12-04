import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const Analytics = () => {
  const navigate = useNavigate();

  const [skillsDist, setSkillsDist] = useState([]);
  const [expStats, setExpStats] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [coverage, setCoverage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingCoverage, setLoadingCoverage] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("sf_userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        setInfo("");

        const userIdParam = `userId=${userId}`;

        const [
          skillsRes,
          expRes,
          statusRes,
          projectsRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/skills-distribution?${userIdParam}`),
          fetch(`${API_BASE_URL}/stats/experience-levels?${userIdParam}`),
          fetch(`${API_BASE_URL}/stats/project-status?${userIdParam}`),
          fetch(`${API_BASE_URL}/projects?${userIdParam}`),
        ]);

        const skillsData = await skillsRes.json();
        const expData = await expRes.json();
        const statusData = await statusRes.json();
        const projectsData = await projectsRes.json();

        if (!skillsRes.ok || !skillsData.success) {
          throw new Error(skillsData.message || "Failed to load skill stats");
        }
        if (!expRes.ok || !expData.success) {
          throw new Error(expData.message || "Failed to load experience stats");
        }
        if (!statusRes.ok || !statusData.success) {
          throw new Error(statusData.message || "Failed to load project stats");
        }
        if (!projectsRes.ok || !projectsData.success) {
          throw new Error(projectsData.message || "Failed to load projects");
        }

        setSkillsDist(skillsData.data || []);
        setExpStats(expData.data || []);
        setProjectStatus(statusData.data || []);
        setProjects(projectsData.data || []);

        if ((projectsData.data || []).length === 0) {
          setInfo("No projects yet – create a project to see coverage analytics.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleCheckCoverage = async () => {
    const userId = localStorage.getItem("sf_userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!selectedProjectId) {
      setError("Please select a project first.");
      return;
    }

    try {
      setLoadingCoverage(true);
      setError("");
      setInfo("");

      const res = await fetch(
        `${API_BASE_URL}/projects/${selectedProjectId}/skill-coverage?userId=${userId}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load project coverage");
      }

      setCoverage(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load project coverage");
    } finally {
      setLoadingCoverage(false);
    }
  };

  // Helpers for simple bar charts
  const getMaxPersonnelCount = () =>
    skillsDist.reduce(
      (max, s) => Math.max(max, Number(s.personnel_count || 0)),
      0
    );

  const getTotalExp = () =>
    expStats.reduce((sum, r) => sum + Number(r.count || 0), 0);

  const getTotalProjects = () =>
    projectStatus.reduce((sum, r) => sum + Number(r.count || 0), 0);

  const maxPersonnelCount = getMaxPersonnelCount() || 1;
  const totalExp = getTotalExp() || 1;
  const totalProj = getTotalProjects() || 1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-20 md:px-10 lg:px-16">
        <header className="mb-8">
          <h1 className="mb-1 text-2xl font-bold md:text-3xl">
            Status & Analytics
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-300">
            Visual overview of skills, experience levels, project status, and
            skill coverage for a selected project.
          </p>
        </header>

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

        {loading ? (
          <p className="text-sm text-slate-400">Loading analytics...</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills distribution */}
            <section className="p-5 border shadow bg-slate-900/80 border-slate-800 rounded-2xl">
              <h2 className="mb-3 text-lg font-semibold">
                Skills Distribution
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                How many personnel have each skill.
              </p>

              {skillsDist.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No skills yet – create skills and assign them to personnel.
                </p>
              ) : (
                <ul className="space-y-2 text-xs md:text-sm">
                  {skillsDist.map((s) => {
                    const count = Number(s.personnel_count || 0);
                    const widthPercent = Math.max(
                      8,
                      (count / maxPersonnelCount) * 100
                    ); // small minimum bar

                    return (
                      <li key={s.skill_id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{s.skill_name}</span>
                          <span className="text-slate-400">
                            {count} person{count === 1 ? "" : "nel"}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Experience level stats */}
            <section className="p-5 border shadow bg-slate-900/80 border-slate-800 rounded-2xl">
              <h2 className="mb-3 text-lg font-semibold">
                Experience Levels
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Distribution of Junior / Mid-Level / Senior personnel.
              </p>

              {expStats.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No personnel yet – add personnel to see this chart.
                </p>
              ) : (
                <ul className="space-y-2 text-xs md:text-sm">
                  {expStats.map((row) => {
                    const count = Number(row.count || 0);
                    const percent = (count / totalExp) * 100;

                    return (
                      <li key={row.experience_level}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {row.experience_level}
                          </span>
                          <span className="text-slate-400">
                            {count} ({percent.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${Math.max(percent, 8)}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Project status stats */}
            <section className="p-5 border shadow bg-slate-900/80 border-slate-800 rounded-2xl">
              <h2 className="mb-3 text-lg font-semibold">
                Project Status Overview
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                How many projects are in each status.
              </p>

              {projectStatus.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No projects yet – create projects to see this chart.
                </p>
              ) : (
                <ul className="space-y-2 text-xs md:text-sm">
                  {projectStatus.map((row) => {
                    const count = Number(row.count || 0);
                    const percent = (count / totalProj) * 100;

                    return (
                      <li key={row.status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{row.status}</span>
                          <span className="text-slate-400">
                            {count} ({percent.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-violet-500"
                            style={{ width: `${Math.max(percent, 8)}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Project coverage */}
            <section className="p-5 border shadow bg-slate-900/80 border-slate-800 rounded-2xl">
              <h2 className="mb-3 text-lg font-semibold">
                Project Skill Coverage
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Check how many of a project&apos;s required skills are covered
                by your personnel.
              </p>

              {/* Project selector + button */}
              <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center">
                <select
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-950 border-slate-700 md:w-72"
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setCoverage(null);
                  }}
                >
                  <option value="">Select a project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleCheckCoverage}
                  disabled={loadingCoverage || !selectedProjectId}
                  className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingCoverage ? "Checking..." : "Check Coverage"}
                </button>
              </div>

              {/* Coverage result */}
              {coverage && (
                <div className="mt-3 text-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-slate-300">
                        Total required skills:{" "}
                        <span className="font-semibold">
                          {coverage.total_required_skills}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        Covered skills:{" "}
                        <span className="font-semibold">
                          {coverage.covered_skills}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="mb-1 text-xs text-slate-400">
                        Coverage
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">
                        {coverage.coverage_percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 mb-4 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-3 bg-emerald-500"
                      style={{
                        width: `${coverage.coverage_percentage || 0}%`,
                      }}
                    />
                  </div>

                  <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                    Required Skills
                  </h3>
                  <ul className="space-y-1 text-xs md:text-sm">
                    {coverage.skills.map((s) => (
                      <li
                        key={s.skill_id}
                        className="flex items-center justify-between"
                      >
                        <span>{s.skill_name} (min L{s.min_proficiency})</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] ${
                            s.covered
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                              : "bg-red-500/20 text-red-300 border border-red-500/50"
                          }`}
                        >
                          {s.covered ? "Covered" : "Missing"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!coverage && selectedProjectId && !loadingCoverage && (
                <p className="mt-2 text-xs text-slate-500">
                  Click &quot;Check Coverage&quot; to see details.
                </p>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer1 />
    </div>
  );
};

export default Analytics;
