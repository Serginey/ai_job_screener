import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import Applicant from "@/lib/models/Applicant";

export async function POST(request: Request) {
  await connectDB();

  const { jobId } = await request.json();

  // 1. fetch the job
  const job = await Job.findById(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // 2. fetch all applicants for this job
  const applicants = await Applicant.find({ jobId });

  if (applicants.length === 0) {
    return NextResponse.json(
      { error: "No applicants found for this job" },
      { status: 400 },
    );
  }

  // 3. build the prompt
  const prompt = `
You are an expert technical recruiter. Rank the following candidates for the job below.

JOB DETAILS:
Title: ${job.title}
Description: ${job.description}
Required Skills: ${job.skills}
Required Experience: ${job.experience} years

CANDIDATES:
${applicants.map((a, i) => `
Candidate ${i + 1}:
Name: ${a.name}
Current Title: ${a.title || "Not specified"}
Skills: ${a.skills}
Years of Experience: ${a.yearsOfExperience}
Education: ${a.degree} ${a.field} at ${a.institution}
Preferred Role: ${a.preferredRole || "Not specified"}
Available for Work: ${a.availableForWork ? "Yes" : "No"}
Source: ${a.source === "umurava" ? "Umurava Platform" : "External"}
`).join("")}

SCORING CRITERIA (weighted):
- Skills match: 40%
- Years of experience: 30%
- Education relevance: 20%
- Availability and role fit: 10%

INSTRUCTIONS:
- Rank ALL candidates from best to worst
- Return ONLY a valid JSON array, no extra text, no markdown
- Each item must have exactly these fields:
  - rank (number)
  - name (string)
  - score (number 0-100)
  - strengths (string)
  - gaps (string)
  - recommendation (string)
  - matchLevel (string: "Strong Match", "Good Match", "Partial Match", or "Poor Match")
`;

  // 4. call Gemini API
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // force a JSON array in the exact shape the shortlist page renders
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                rank: { type: "NUMBER" },
                name: { type: "STRING" },
                score: { type: "NUMBER" },
                strengths: { type: "STRING" },
                gaps: { type: "STRING" },
                recommendation: { type: "STRING" },
                matchLevel: {
                  type: "STRING",
                  enum: ["Strong Match", "Good Match", "Partial Match", "Poor Match"],
                },
              },
              required: ["rank", "name", "score", "strengths", "gaps", "recommendation", "matchLevel"],
            },
          },
        },
      }),
    },
  );

  const geminiData = await geminiResponse.json();

  // check if Gemini returned an error
  if (geminiData.error) {
    console.error("Gemini error:", geminiData.error.message);
    return NextResponse.json(
      { error: "AI service is busy. Please wait a moment and try again." },
      { status: 503 },
    );
  }

  // 5. parse the JSON from Gemini's response
  let shortlist;
  try {
    shortlist = JSON.parse(geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
  } catch {
    return NextResponse.json(
      { error: "AI returned an unexpected format. Please try again." },
      { status: 502 },
    );
  }

  // 6. return the ranked list
  return NextResponse.json(shortlist);
}
