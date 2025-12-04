import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar2 from "../NavBar/NavBarDash";
import Footer1 from "../Footers/Footer1";
import Analytics from "./Analytics2";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check session when page loads
  useEffect(() => {
    const userId = localStorage.getItem("sf_userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  const userName = localStorage.getItem("sf_userName") || "User";

  const handleLogout = () => {
    localStorage.removeItem("sf_userId");
    localStorage.removeItem("sf_userName");
    navigate("/login");
  };

  // All “essential” sections that you currently have routes for
  const sections = [
    {
      key: "personnel",
      title: "Personnel Management",
      description:
        "Create, update, and manage your consultancy personnel. Track roles, emails, and experience levels.",
      actionLabel: "Go to Personnel",
      path: "/personnel",
    },
    {
      key: "skills",
      title: "Skill Catalog",
      description:
        "Manage your skill catalog: programming languages, frameworks, tools, and soft skills.",
      actionLabel: "Go to Skills",
      path: "/skills",
    },
    {
      key: "personnel-skills",
      title: "Personnel Skills",
      description:
        "Assign skills to each person and maintain their proficiency levels (1–5).",
      actionLabel: "Manage Personnel Skills",
      path: "/personnel-skills",
    },
    {
      key: "projects",
      title: "Project Management",
      description:
        "Create projects, define descriptions, dates, and track their status (Planning, Active, Completed).",
      actionLabel: "Go to Projects",
      path: "/projects",
    },
    {
      key: "project-required-skills",
      title: "Project Required Skills",
      description:
        "Define which skills and minimum proficiency levels are required for each project.",
      actionLabel: "Manage Project Skills",
      path: "/project-required-skills",
    },
    {
      key: "matching",
      title: "Skill Matching",
      description:
        "Run the matching algorithm to find the best personnel for each project based on required skills.",
      actionLabel: "Open Matching",
      path: "/matching",
    },
    {
      key: "analytics",
      title: "Status & Analytics",
      description:
        "View charts for skills, experience levels, project statuses, and skill coverage for a specific project.",
      actionLabel: "Open Status & Analytics",
      path: "/analytics",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-10 md:px-8 lg:px-12 md:px-10 lg:px-16 lg:mx-20">
        {/* Layout: Left sidebar (links) + Right content (Analytics) */}
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="flex flex-col p-4 border shadow-xl bg-slate-900/90 border-slate-800 rounded-2xl">
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">
                Workspace
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-50">
                Skill Fusion Console
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Navigate between core management modules.
              </p>
            </div>

            <nav className="flex-1 mt-2 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => navigate(section.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex flex-col border
                    ${
                      isActive(section.path)
                        ? "bg-blue-600/20 border-blue-500/70"
                        : "bg-transparent border-transparent hover:bg-slate-800/80 hover:border-slate-700"
                    }`}
                >
                  <span className="flex items-center justify-between text-sm font-semibold text-slate-50">
                    {section.title}
                    <span className="text-[11px] text-slate-400 ml-2">
                      &gt;
                    </span>
                  </span>
                  <span className="mt-1 text-[11px] leading-snug text-slate-400 line-clamp-2">
                    {section.description}
                  </span>
                </button>
              ))}
            </nav>

            {/* Optional quick link footer in sidebar */}
            <div className="pt-3 mt-3 text-[11px] border-t border-slate-800 text-slate-500">
              Logged in as{" "}
              <span className="font-medium text-slate-200">{userName}</span>
            </div>
          </aside>

          {/* Main Content: Welcome + Analytics segment on the right */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex flex-col min-h-[300px]">
            {/* Header with user name + logout */}
            <header className="flex flex-col gap-3 p-5 border-b border-slate-800 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold md:text-3xl">
                  Welcome, {userName}
                </h1>
                <p className="max-w-2xl mt-1 text-sm md:text-base text-slate-300">
                  Use this console to manage personnel, skills, projects, and
                  requirements. The live analytics on the right keeps you
                  updated on the current status.
                </p>
              </div>

              
            </header>

            {/* Analytics content area */}
            <div className="flex-1 p-4 overflow-auto md:p-5">
              {/* 
                If your Analytics component already has its own NavBar/Footer,
                consider extracting the core charts into a reusable <AnalyticsOverview />
                and render that here instead.
              */}
              <Analytics />
            </div>
          </section>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default Dashboard;
