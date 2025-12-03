import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar2 from "../NavBar/NavBar2";
import Footer1 from "../Footers/Footer1";

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    {
      key: "personnel",
      title: "Personnel Management",
      description:
        "Create, update, and manage people in your consultancy. Track roles, emails, and experience levels.",
      actionLabel: "Go to Personnel",
      path: "/personnel",
    },
    {
      key: "skills",
      title: "Skill Management",
      description:
        "Manage your global skill catalog and assign skills with proficiency levels to team members.",
      actionLabel: "Go to Skills",
      path: "/skills",
    },
    {
      key: "projects",
      title: "Project Management",
      description:
        "Create projects, set dates and statuses, and define required skills for each project.",
      actionLabel: "Go to Projects",
      path: "/projects",
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
      title: "Analytics & Reports",
      description:
        "View high-level stats and generate overview reports for skills, personnel, and projects.",
      actionLabel: "View Analytics",
      path: "/analytics",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavBar2 />

      <main className="flex-1 px-4 pt-24 pb-16 md:px-10 lg:px-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            Skill Fusion Dashboard
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-300">
            Use this dashboard to quickly navigate between personnel, skills,
            projects, matching, and analytics sections of the system.
          </p>
        </header>

        {/* Sections grid */}
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
