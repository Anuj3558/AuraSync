import mongoose from "mongoose";

const jobOpeningSchema = new mongoose.Schema(
  {
    positionTitle: {
      type: String,
      required: [true, "Position title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    experienceLevel: {
      type: String,
      enum: ["Internship", "Entry Level", "Mid Level", "Senior Level", "Lead", "Director", "Executive"],
      required: [true, "Experience level is required"],
    },
    skills: {
      type: [String],
      required: [true, "Skills are required"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
      required: [true, "Requirements are required"],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: [true, "Recruiter reference is required"],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const JobOpening = mongoose.model("JobOpening", jobOpeningSchema);

export default JobOpening;
