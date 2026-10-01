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
Use an empty string for anything the resume does not mention.
yearsOfExperience is the total years of professional experience as a number (0 if none).`,
              },
            ],
          },
        ],
        // ask Gemini for JSON that matches the Applicant model instead of free text
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              email: { type: "STRING" },
              location: { type: "STRING" },
              title: { type: "STRING" },
              skills: { type: "STRING", description: "comma separated technical skills" },
              yearsOfExperience: { type: "NUMBER" },
              degree: { type: "STRING" },
              field: { type: "STRING" },
              institution: { type: "STRING" },
            },
            required: ["name", "skills", "yearsOfExperience"],
          },
        },
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

  let parsed;
  try {
    parsed = JSON.parse(geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
  } catch {
    return NextResponse.json(
      { error: "AI returned unexpected format. Try again." },
      { status: 500 }
    );
  }

  if (!parsed.name || !parsed.skills) {
    return NextResponse.json(
      { error: "Could not find a name and skills in this resume." },
      { status: 422 }
    );
  }

  // save to MongoDB — field names must match the Applicant schema
  const applicant = await Applicant.create({
    jobId,
    name: parsed.name,
    email: parsed.email || "",
    location: parsed.location || "",
    title: parsed.title || "",
    skills: parsed.skills,
    yearsOfExperience: Number(parsed.yearsOfExperience) || 0,
    degree: parsed.degree || "",
    field: parsed.field || "",
    institution: parsed.institution || "",
    source: "external",
  });

  return NextResponse.json(applicant, { status: 201 });
}