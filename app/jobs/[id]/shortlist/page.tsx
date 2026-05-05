"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Candidate = {
  rank: number;
  name: string;
  score: number;
  strengths: string;
  gaps: string;
  recommendation: string;
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-700"
      : score >= 60
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${color}`}>
      {score}/100
    </span>
  );
}

export default function ShortlistPage() {
  const { id } = useParams();
  const [shortlist, setShortlist] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    runScreening();
  }, []);

  async function runScreening() {
    setLoading(true);

    const response = await fetch("/api/screen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });

    if (!response.ok) {
      setError("Screening failed. Make sure this job has applicants.");
      setLoading(false);
      return;
    }

    const data = await response.json();
    setShortlist(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">AI is screening candidates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <a
            href="../applicants"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Applicants
          </a>
          <h1 className="text-3xl font-bold text-gray-800 mt-1">
            AI Shortlist
          </h1>
          <p className="text-gray-500 mt-1">
            {shortlist.length} candidates ranked by AI
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {shortlist.map((candidate) => (
            <div
              key={candidate.rank}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300">
                    #{candidate.rank}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {candidate.name}
                  </h2>
                </div>
                <ScoreBadge score={candidate.score} />
              </div>

              <div className="flex flex-col gap-2">
                <div className="bg-green-50 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">
                    Strengths
                  </p>
                  <p className="text-sm text-green-800">{candidate.strengths}</p>
                </div>

                <div className="bg-red-50 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">
                    Gaps
                  </p>
                  <p className="text-sm text-red-800">{candidate.gaps}</p>
                </div>

                <div className="bg-blue-50 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">
                    Recommendation
                  </p>
                  <p className="text-sm text-blue-800">
                    {candidate.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}