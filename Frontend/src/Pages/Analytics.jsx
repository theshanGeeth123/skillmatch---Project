import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar3";
import Footer1 from "../Footers/Footer1";
import Logo1 from "../Images/Logo2.png";
import jsPDF from "jspdf";

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

  // Report state
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const userId = localStorage.getItem("sf_userId");

  const handleGenerateReport = async () => {
    if (!userId) return;

    setLoadingReport(true);
    setReport(null);
    setError("");
    setInfo("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/reports/overview?userId=${userId}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate report");
      }

      setReport(data.data);
      setInfo("Overview report generated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate report");
    } finally {
      setLoadingReport(false);
    }
  };

  // ---- REPORT: DOWNLOAD AS PDF ----
const handleDownloadReportPdf = () => {
  if (!report) return;

  const dateStr = new Date().toISOString().slice(0, 10);
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = { left: 16, right: 16, top: 18, bottom: 18 };

  let y = margin.top;

  // Helper: add new page if not enough vertical space
  const ensureSpace = (needed = 12) => {
    if (y + needed > pageHeight - margin.bottom) {
      doc.addPage();
      y = margin.top;
    }
  };

  // Helper: section header with accent bar + divider
  const addSectionHeader = (title) => {
    ensureSpace(14);
    doc.setDrawColor(79, 70, 229); // indigo accent
    doc.setFillColor(79, 70, 229);
    doc.rect(margin.left, y - 2, 2, 9, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900-ish
    doc.text(title, margin.left + 6, y + 4);

    y += 10;
    doc.setDrawColor(226, 232, 240); // light divider
    doc.line(margin.left, y, pageWidth - margin.right, y);
    y += 4;
  };

  // Helper: simple bullet line
  const addBulletLine = (text) => {
    ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(`• ${text}`, margin.left + 2, y);
    y += 6;
  };

  // We’ll load logo first; once ready we draw everything & save
  const img = new Image();
  img.src = Logo1;

  img.onload = () => {
    // ======= HEADER BAND =======
    doc.setFillColor(15, 23, 42); // dark header
    doc.rect(0, 0, pageWidth, 30, "F");

    try {
      // Logo in header
      doc.addImage(img, "PNG", margin.left, 6, 18, 18);
    } catch (e) {
      console.warn("Logo could not be added to PDF:", e);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SkillFusion", pageWidth / 2, 13, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("System Overview Report", pageWidth / 2, 21, {
      align: "center",
    });

    // Reset for body
    y = 38;
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFontSize(10);
    doc.text(
      `Generated at: ${new Date(report.generated_at).toLocaleString()}`,
      margin.left,
      y
    );
    y += 5;
    doc.text(`Exported on: ${dateStr}`, margin.left, y);
    y += 8;

    // ======= SUMMARY SECTION =======
    addSectionHeader("Summary");

    const cardGap = 4;
    const availableWidth = pageWidth - margin.left - margin.right;
    const cardWidth = (availableWidth - cardGap * 2) / 3;
    const cardHeight = 24;
    const cardY = y;

    const summaryItems = [
      {
        label: "Total Skills",
        value: report.summary.total_skills,
      },
      {
        label: "Total Personnel",
        value: report.summary.total_personnel,
      },
      {
        label: "Total Projects",
        value: report.summary.total_projects,
      },
    ];

    doc.setFontSize(9);
    summaryItems.forEach((item, idx) => {
      const x = margin.left + idx * (cardWidth + cardGap);

      // Card background
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, cardY, cardWidth, cardHeight, 2, 2, "FD");

      // Label
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(item.label, x + 4, cardY + 7);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(String(item.value ?? 0), x + 4, cardY + 17);

      // Reset font for next card
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    });

    y = cardY + cardHeight + 10;

    // ======= SKILLS DISTRIBUTION =======
    addSectionHeader("Skills Distribution");

    if (!report.skills_distribution.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("No skills in this account.", margin.left + 2, y);
      y += 8;
    } else {
      const maxPersonnel = report.skills_distribution.reduce(
        (max, s) => Math.max(max, Number(s.personnel_count || 0)),
        0
      ) || 1;

      report.skills_distribution.forEach((s) => {
        ensureSpace(10);

        const count = Number(s.personnel_count || 0);
        const barWidth =
          ((count / maxPersonnel) * (availableWidth - 20)) || 0;
        const barHeight = 4;

        // Label row
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 64, 175); // blue-800
        doc.text(s.skill_name, margin.left + 2, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(
          `${count} person${count === 1 ? "" : "nel"} (${s.category})`,
          pageWidth - margin.right,
          y,
          { align: "right" }
        );

        y += 4;

        // Bar background
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(
          margin.left + 2,
          y,
          availableWidth - 20,
          barHeight,
          1,
          1,
          "FD"
        );

        // Bar fill
        doc.setFillColor(59, 130, 246); // blue-500
        doc.roundedRect(
          margin.left + 2,
          y,
          Math.max(barWidth, 6),
          barHeight,
          1,
          1,
          "F"
        );

        y += barHeight + 5;
      });
    }

    // ======= EXPERIENCE LEVELS =======
    addSectionHeader("Experience Levels");

    if (!report.experience_levels.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("No personnel yet.", margin.left + 2, y);
      y += 8;
    } else {
      const totalExp = report.experience_levels.reduce(
        (sum, r) => sum + Number(r.count || 0),
        0
      ) || 1;

      report.experience_levels.forEach((row) => {
        ensureSpace(10);

        const count = Number(row.count || 0);
        const percent = (count / totalExp) * 100;
        const barWidth =
          ((percent / 100) * (availableWidth - 20)) || 0;
        const barHeight = 4;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(22, 101, 52); // emerald-800
        doc.text(row.experience_level, margin.left + 2, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(
          `${count} (${percent.toFixed(0)}%)`,
          pageWidth - margin.right,
          y,
          { align: "right" }
        );

        y += 4;

        // Bar
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(
          margin.left + 2,
          y,
          availableWidth - 20,
          barHeight,
          1,
          1,
          "FD"
        );

        doc.setFillColor(16, 185, 129); // emerald-500
        doc.roundedRect(
          margin.left + 2,
          y,
          Math.max(barWidth, 6),
          barHeight,
          1,
          1,
          "F"
        );

        y += barHeight + 5;
      });
    }

    // ======= PROJECT STATUS OVERVIEW =======
    addSectionHeader("Project Status Overview");

    if (!report.project_status.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("No projects yet.", margin.left + 2, y);
      y += 8;
    } else {
      const totalProj = report.project_status.reduce(
        (sum, r) => sum + Number(r.count || 0),
        0
      ) || 1;

      report.project_status.forEach((row) => {
        ensureSpace(10);

        const count = Number(row.count || 0);
        const percent = (count / totalProj) * 100;
        const barWidth =
          ((percent / 100) * (availableWidth - 20)) || 0;
        const barHeight = 4;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(88, 28, 135); // violet-900
        doc.text(row.status, margin.left + 2, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(
          `${count} (${percent.toFixed(0)}%)`,
          pageWidth - margin.right,
          y,
          { align: "right" }
        );

        y += 4;

        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(
          margin.left + 2,
          y,
          availableWidth - 20,
          barHeight,
          1,
          1,
          "FD"
        );

        doc.setFillColor(139, 92, 246); // violet-500
        doc.roundedRect(
          margin.left + 2,
          y,
          Math.max(barWidth, 6),
          barHeight,
          1,
          1,
          "F"
        );

        y += barHeight + 5;
      });
    }

    // ======= (OPTIONAL) PER-PROJECT COVERAGE SUMMARY =======
    // If you want to also reflect the current "coverage" project in the PDF,
    // you could add another section here using coverage data.

    doc.save(`skillfusion-report-${dateStr}.pdf`);
  };
};


  // ---- INITIAL ANALYTICS DATA (charts) ----
  useEffect(() => {
    const userIdLocal = localStorage.getItem("sf_userId");
    if (!userIdLocal) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        setInfo("");

        const userIdParam = `userId=${userIdLocal}`;

        const [skillsRes, expRes, statusRes, projectsRes] = await Promise.all([
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

  // ---- PROJECT COVERAGE HANDLER ----
  const handleCheckCoverage = async () => {
    const userIdLocal = localStorage.getItem("sf_userId");
    if (!userIdLocal) {
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
        `${API_BASE_URL}/projects/${selectedProjectId}/skill-coverage?userId=${userIdLocal}`
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

  // ---- Chart helpers ----
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

      <main className="flex-1 px-4 pt-24 pb-20 md:px-10 lg:px-16 lg:mx-20">
        {/* Header with logo */}
        <header className="flex items-center gap-4 mb-8">
          
          <div>
            <h1 className="mb-1 text-2xl font-bold md:text-3xl">
              Status &amp; Analytics
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-slate-300">
              Visual overview of skills, experience levels, project status, and
              skill coverage for a selected project.
            </p>
          </div>
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
            {/* Skills Distribution */}
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
                    );

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

            {/* Experience Levels */}
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

            {/* Project Status */}
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

            {/* Project Skill Coverage */}
            <section className="p-5 border shadow bg-slate-900/80 border-slate-800 rounded-2xl">
              <h2 className="mb-3 text-lg font-semibold">
                Project Skill Coverage
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Check how many of a project&apos;s required skills are covered
                by your personnel.
              </p>

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
                        <span>
                          {s.skill_name} (min L{s.min_proficiency})
                        </span>
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

            {/* System Overview Report */}
            <section className="p-5 mt-6 border bg-slate-900/80 border-slate-800 rounded-2xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-1 text-lg font-semibold">
                    System Overview Report
                  </h2>
                  <p className="max-w-xl text-xs text-slate-400">
                    Combined summary of skills, personnel, and projects for your
                    account. Generate and download a PDF report for management
                    or documentation.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    disabled={loadingReport}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingReport ? "Generating..." : "Generate Report"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadReportPdf}
                    disabled={!report}
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-xl hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Small summary preview */}
              {report && (
                <div className="mt-4 text-xs md:text-sm text-slate-200">
                  <p className="mb-2">
                    Generated at:{" "}
                    <span className="text-slate-400">
                      {new Date(report.generated_at).toLocaleString()}
                    </span>
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-slate-400">Total Skills</p>
                      <p className="text-lg font-semibold">
                        {report.summary.total_skills}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Total Personnel</p>
                      <p className="text-lg font-semibold">
                        {report.summary.total_personnel}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Total Projects</p>
                      <p className="text-lg font-semibold">
                        {report.summary.total_projects}
                      </p>
                    </div>
                  </div>
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

export default Analytics;
