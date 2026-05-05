import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import Applicant from "@/lib/models/Applicant";

export async function POST(request: Request) {
  await connectDB();

  const { jobId } = await request.json();

  // 1. fetch the job
  const job = await Job.findById(jobId);

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

  // 5. extract the text from Gemini response
  const rawText = geminiData.candidates[0].content.parts[0].text;

  // 6. clean and parse the JSON
  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const shortlist = JSON.parse(cleaned);

  // 7. return the ranked list
  return NextResponse.json(shortlist);
}
