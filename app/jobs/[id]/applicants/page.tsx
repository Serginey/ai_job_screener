"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResumeUpload from "@/Components/ResumeUpload";

type Applicant = {
  _id: string;
  name: string;
  email: string;
  location: string;
  title: string;
  skills: string;
  yearsOfExperience: number;
  degree: string;
  field: string;
  institution: string;
  githubUrl: string;
  portfolioUrl: string;
  availableForWork: boolean;
  preferredRole: string;
  source: string;
};

export default function ApplicantsPage() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showing, setShowing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    title: "",
    skills: "",
    yearsOfExperience: "",
    degree: "",
    field: "",
    institution: "",
    githubUrl: "",
    portfolioUrl: "",
    availableForWork: true,
    preferredRole: "",
  });

  useEffect(() => {
    fetchApplicants();
  }, []);

  async function fetchApplicants() {
    const response = await fetch(`/api/applicants?jobId=${id}`);
    const data = await response.json();
    setApplicants(data);
    setLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement;
    const value =
      target.type === "checkbox" ? target.checked : target.value;
    setForm({ ...form, [target.name]: value });
  }

  async function handleAddApplicant(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/applicants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: id,
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience),
        source: "umurava",
      }),
    });

    setForm({
      name: "",
      email: "",
      location: "",
      title: "",
      skills: "",
      yearsOfExperience: "",
      degree: "",
      field: "",
      institution: "",
      githubUrl: "",
      portfolioUrl: "",
      availableForWork: true,
      preferredRole: "",
    });

    setShowing(false);
    setSaving(false);
    fetchApplicants();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading applicants...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <a href="/jobs" className="text-sm text-blue-600 hover:underline">
              ← Back to Jobs
            </a>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">
              Applicants
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowing(!showing)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              + Add Applicant
            </button>
            <a
              href="shortlist"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Run AI Screening
            </a>
          </div>
        </div>

        {/* Resume Upload — Scenario 2 */}
        <ResumeUpload
          jobId={id as string}
          onUploadComplete={fetchApplicants}
        />

        {/* Add Applicant Form — Scenario 1 (Umurava structured profile) */}
        {showing && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                New Umurava Profile
              </h2>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                Scenario 1
              </span>
            </div>

            <form
              onSubmit={handleAddApplicant}
              className="flex flex-col gap-3"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Personal Info
              </p>
              <input name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="location" placeholder="Location e.g. Kigali, Rwanda" value={form.location} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                Professional Info
              </p>
              <input name="title" placeholder="Job Title e.g. Frontend Engineer" value={form.title} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="skills" placeholder="Skills e.g. React, TypeScript, Node.js *" value={form.skills} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="yearsOfExperience" type="number" placeholder="Years of Experience *" value={form.yearsOfExperience} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="preferredRole" placeholder="Preferred Role e.g. Full Stack Developer" value={form.preferredRole} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                Education
              </p>
              <input name="degree" placeholder="Degree e.g. BSc, MSc" value={form.degree} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="field" placeholder="Field e.g. Computer Science" value={form.field} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="institution" placeholder="Institution e.g. University of Rwanda" value={form.institution} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                Portfolio
              </p>
              <input name="githubUrl" placeholder="GitHub URL" value={form.githubUrl} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="portfolioUrl" placeholder="Portfolio URL" value={form.portfolioUrl} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                Availability
              </p>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="availableForWork"
                  checked={form.availableForWork}
                  onChange={handleChange}
                  className="rounded"
                />
                Available for work
              </label>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 bg-blue-600 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        )}

        {/* Applicants list */}
        {applicants.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">No applicants yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {applicants.map((applicant) => (
              <div key={applicant._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {applicant.name}
                      </h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${applicant.source === "umurava" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {applicant.source === "umurava" ? "Umurava" : "External"}
                      </span>
                    </div>
                    {applicant.title && <p className="text-sm text-gray-600 mt-1">{applicant.title}</p>}
                    <p className="text-sm text-gray-500 mt-1">Skills: {applicant.skills}</p>
                    <p className="text-sm text-gray-500">Experience: {applicant.yearsOfExperience} years</p>
                    {applicant.degree && <p className="text-sm text-gray-500">Education: {applicant.degree} {applicant.field}</p>}
                    {applicant.location && <p className="text-sm text-gray-500">Location: {applicant.location}</p>}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${applicant.availableForWork ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {applicant.availableForWork ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}