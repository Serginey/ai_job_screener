import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Applicant from "@/lib/models/Applicant";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const applicants = await Applicant.find({ jobId });
  return NextResponse.json(applicants);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();

  const applicant = await Applicant.create({
    jobId: body.jobId,
    name: body.name,
    email: body.email || "",
    location: body.location || "",
    title: body.title || "",
    skills: body.skills,
    yearsOfExperience: Number(body.yearsOfExperience),
    degree: body.degree || "",
    field: body.field || "",
    institution: body.institution || "",
    githubUrl: body.githubUrl || "",
    portfolioUrl: body.portfolioUrl || "",
    availableForWork: body.availableForWork ?? true,
    preferredRole: body.preferredRole || "",
    source: body.source || "umurava",
  });

  return NextResponse.json(applicant, { status: 201 });
}