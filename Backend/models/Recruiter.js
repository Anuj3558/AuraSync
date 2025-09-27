import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, "Owner/Recruiter name is required"],
      trim: true,
    },
    officialWebsite: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\w-]+)+([\w.-]*)+(\.[a-z]{2,6})+\/?/,
        "Please fill a valid URL",
      ],
    },
    linkedin: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
        "Please enter a valid LinkedIn profile URL",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

export default Recruiter;
