import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

  // Personal Info
  name: { type: String, required: true },
  email: { type: String, default: "" },
  location: { type: String, default: "" },

  // Professional Info
  title: { type: String, default: "" },
  skills: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },

  // Education
  degree: { type: String, default: "" },
  field: { type: String, default: "" },
  institution: { type: String, default: "" },

  // Portfolio
  githubUrl: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },

  // Availability
  availableForWork: { type: Boolean, default: true },
  preferredRole: { type: String, default: "" },

  // Source — is this from Umurava platform or external?
  source: { type: String, enum: ["umurava", "external"], default: "umurava" },

  createdAt: { type: Date, default: Date.now },
});

const Applicant =
  mongoose.models.Applicant ||
  mongoose.model("Applicant", ApplicantSchema);

export default Applicant;