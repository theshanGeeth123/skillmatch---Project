import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const Dashboard = () => {
  const navigate = useNavigate();

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
    // Later, when you create /analytics route, we can add:
    // {
    //   key: "analytics",
    //   title: "Analytics & Reports",
    //   description:
    //     "View charts and download reports for skills, personnel and projects.",
    //   actionLabel: "View Analytics",
    //   path: "/analytics",
    // },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-16 md:px-10 lg:px-16">
        {/* Header with user name + logout */}
        <header className="flex flex-col mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold md:text-3xl">
              Welcome, {userName}
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-slate-300">
              Use this dashboard to navigate between personnel, skills, projects,
              personnel skill assignments, project requirements, and matching.
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 mt-4 text-sm font-semibold transition-all bg-red-500 md:mt-0 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Dashboard sections */}
        <section className="grid gap-5 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.key}
              className="flex flex-col justify-between p-5 transition-all duration-200 border shadow-lg bg-slate-900/80 border-slate-800 rounded-2xl hover:border-blue-500/60 hover:-translate-y-1"
            >
              <div>
                <h2 className="mb-2 text-lg font-semibold md:text-xl">
                  {section.title}
                </h2>
                <p className="mb-4 text-xs md:text-sm text-slate-300">
                  {section.description}
                </p>
              </div>

              <button
                onClick={() => navigate(section.path)}
                className="inline-flex items-center justify-center px-4 py-2 mt-2 text-xs font-semibold text-white transition-all bg-blue-500 rounded-xl md:text-sm hover:bg-blue-600"
              >
                {section.actionLabel}
              </button>
            </div>
          ))}
        </section>
      </main>

      <Footer1 />
    </div>
  );
};

export default Dashboard;
