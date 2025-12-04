import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar3 from "../NavBar/NavBar3";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  name: "",
  email: "",
  role: "",
  experience_level: "Junior",
};

const Personnel = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const [personnel, setPersonnel] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check login + set userId
  useEffect(() => {
    const storedId = localStorage.getItem("sf_userId");
    if (!storedId) {
      navigate("/login");
    } else {
      setUserId(storedId);
    }
  }, [navigate]);

  // Fetch all personnel for this user
  const loadPersonnel = async (uid) => {
    const effectiveUserId = uid || userId;
    if (!effectiveUserId) return;

    try {
      setLoadingList(true);
      setError("");

      const res = await fetch(
        `${API_BASE_URL}/personnel?userId=${effectiveUserId}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load personnel");
      }

      setPersonnel(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load personnel");
    } finally {
      setLoadingList(false);
    }
  };

  // Load when userId is ready
  useEffect(() => {
    if (userId) {
      loadPersonnel(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/personnel/${editingId}?userId=${userId}`
        : `${API_BASE_URL}/personnel?userId=${userId}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save personnel");
      }

      setSuccessMessage(
        editingId
          ? "Personnel updated successfully."
          : "Personnel created successfully."
      );
      setForm(emptyForm);
      setEditingId(null);
      loadPersonnel();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save personnel");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (person) => {
    setForm({
      name: person.name || "",
      email: person.email || "",
      role: person.role || "",
      experience_level: person.experience_level || "Junior",
    });
    setEditingId(person.id);
    setError("");
    setSuccessMessage("");
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this person?");
    if (!ok) return;

    if (!userId) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setError("");
      const res = await fetch(
        `${API_BASE_URL}/personnel/${id}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete personnel");
      }

      setSuccessMessage("Personnel deleted successfully.");
      loadPersonnel();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete personnel");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 ">
      <NavBar3 />

      <main className="flex-1 px-4 pt-24 pb-16 md:px-10 lg:px-16 lg:mx-20">
        <header className="flex flex-col gap-2 mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Personnel Management
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-slate-300">
              Manage the people in your consultancy: names, emails, roles, and
              experience level.
            </p>
          </div>
        </header>

        {/* Messages */}
        {error && (
          <div className="max-w-xl px-4 py-2 mb-4 text-sm text-red-100 border rounded-lg bg-red-900/40 border-red-500/50">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="max-w-xl px-4 py-2 mb-4 text-sm border rounded-lg bg-emerald-900/40 border-emerald-500/50 text-emerald-100">
            {successMessage}
          </div>
        )}

        {/* Form + list layout */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Form */}
          <section className="p-5 border shadow-lg bg-slate-900/80 border-slate-800 rounded-2xl">
            <h2 className="mb-3 text-lg font-semibold">
              {editingId ? "Edit Personnel" : "Add New Personnel"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-slate-300" htmlFor="name">
                  Name<span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300" htmlFor="email">
                  Email<span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="person@example.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300" htmlFor="role">
                  Role / Title
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder='e.g. "Frontend Developer"'
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-slate-300"
                  htmlFor="experience_level"
                >
                  Experience Level<span className="text-red-400">*</span>
                </label>
                <select
                  id="experience_level"
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-950/60 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? editingId
                      ? "Saving..."
                      : "Adding..."
                    : editingId
                    ? "Save Changes"
                    : "Add Personnel"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm border rounded-xl border-slate-600 text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* List */}
          <section className="p-5 border shadow-lg bg-slate-900/80 border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Personnel List</h2>
              {loadingList && (
                <span className="text-xs text-slate-400">Loading...</span>
              )}
            </div>

            {personnel.length === 0 && !loadingList ? (
              <p className="text-sm text-slate-400">
                No personnel found. Use the form on the left to add someone.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead className="text-left border-b text-slate-400 border-slate-700/70">
                    <tr>
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Email</th>
                      <th className="py-2 pr-2">Role</th>
                      <th className="py-2 pr-2">Level</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personnel.map((person) => (
                      <tr
                        key={person.id}
                        className="border-b border-slate-800/70 last:border-none"
                      >
                        <td className="py-2 pr-2">{person.name}</td>
                        <td className="py-2 pr-2 text-slate-300">
                          {person.email}
                        </td>
                        <td className="py-2 pr-2 text-slate-300">
                          {person.role || "-"}
                        </td>
                        <td className="py-2 pr-2 text-slate-300">
                          {person.experience_level}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => handleEdit(person)}
                            className="px-3 py-1 mr-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(person.id)}
                            className="px-3 py-1 text-xs bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            Delete
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
      </main>

      <Footer1 />
    </div>
  );
};

export default Personnel;
