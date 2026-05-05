export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1 rounded-full">
          AI-Powered Recruitment
        </span>
        <h1 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
          Screen candidates in seconds, not days
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          Post a job, add applicants, and let AI rank the best candidates with
          clear explanations — so your team focuses on interviews, not
          screening.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <a
            href="/jobs/new"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-base font-medium hover:bg-blue-700"
          >
            Post a Job
          </a>
          <a
            href="/jobs"
            className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl text-base font-medium hover:bg-gray-50"
          >
            View Jobs
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-8 pb-24 grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">📋</div>
          <h3 className="font-semibold text-gray-800 mb-2">Post Jobs</h3>
          <p className="text-sm text-gray-500">
            Define the role, required skills, and experience level in seconds.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">👥</div>
          <h3 className="font-semibold text-gray-800 mb-2">Add Applicants</h3>
          <p className="text-sm text-gray-500">
            Add candidates manually or upload their profiles in bulk.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="font-semibold text-gray-800 mb-2">AI Screening</h3>
          <p className="text-sm text-gray-500">
            Gemini AI ranks every candidate with scores and clear reasoning.
          </p>
        </div>
      </div>
    </main>
  );
}