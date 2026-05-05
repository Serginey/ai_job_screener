import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";

// GET /api/jobs — fetch all jobs
export async function GET() {
  await connectDB();
  const jobs = await Job.find();
  return NextResponse.json(jobs);
}

// POST /api/jobs — create a new job
export async function POST(request: Request) {
  await connectDB();

  // read the JSON body the frontend sends
  const body = await request.json();
  const { title, description, skills, experience } = body;

  // save to MongoDB
  const job = await Job.create({ title, description, skills, experience });

  return NextResponse.json(job, { status: 201 });
}