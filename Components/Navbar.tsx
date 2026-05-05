export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <a href="/" className="text-xl font-bold text-blue-600">
        Umurava Screener
      </a>
      <div className="flex gap-6">
        <a
          href="/jobs"
          className="text-sm text-gray-600 hover:text-blue-600 font-medium"
        >
          All Jobs
        </a>
        <a
          href="/jobs/new"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          + Post a Job
        </a>
      </div>
    </nav>
  );
}