import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Applicant from "@/lib/models/Applicant";

export async function POST(request: Request) {
  await connectDB();

  const { jobId, base64, filename } = await request.json();

  // send PDF to Gemini and ask it to extract candidate info
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: base64,
                },
              },
              {
                text: `Extract the candidate information from this resume.
Return ONLY a valid JSON object with no extra text, no markdown, no backticks.
The object must have exactly these fields:
- name (string)
- skills (comma separated string of their technical skills)
- experience (number of years as a number only)
- education (their highest degree and field)

Example:
{
  "name": "John Doe",
  "skills": "React, TypeScript, Node.js",
  "experience": 4,
  "education": "BSc Computer Science"
}`,
              },
            ],
          },
        ],
      }),
    }
  );

  const geminiData = await response.json();

  if (geminiData.error) {
    return NextResponse.json(
      { error: "AI failed to read the resume. Try again." },
      { status: 503 }
    );
  }

  // extract and clean the text
  const rawText = geminiData.candidates[0].content.parts[0].text;
  const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "AI returned unexpected format. Try again." },
      { status: 500 }
    );
  }

  // save to MongoDB
  const applicant = await Applicant.create({
    jobId,
    name: parsed.name,
    skills: parsed.skills,
    experience: parsed.experience,
    education: parsed.education,
  });

  return NextResponse.json(applicant, { status: 201 });
}