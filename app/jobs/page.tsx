"use client";

import { useEffect, useState } from "react";

type Job = {
  _id: string;
  title: string;
  skills: string;
  experience: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch real jobs from our API when the page loads
    async function fetchJobs() {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    }

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading jobs...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Jobs</h1>
          <a
            href="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Post a Job
          </a>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">No jobs yet. Post your first job.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Skills: {job.skills}
                  </p>
                  <p className="text-sm text-gray-500">
                    Experience: {job.experience} years
                  </p>
                </div>

                <a
                  href={`/jobs/${job._id}/applicants`}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  View Applicants
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}