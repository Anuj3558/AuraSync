// models/Position.js
import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const positionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Position title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    recruiter: {
      type: Types.ObjectId,
      ref: "Recruiter",
      required: [true, "Recruiter id is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Position = model("Position", positionSchema);

export default Position;
