import mongoose from "mongoose";

// this defines the shape of a job document in MongoDB
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: String, required: true },
  experience: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// if the model already exists use it, otherwise create it
// this prevents errors in development when Next.js hot-reloads
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;