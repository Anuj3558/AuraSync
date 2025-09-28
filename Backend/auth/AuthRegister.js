import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create new recruiter account
export const signupRecruiter = async (req, res) => {
  try {
    const { companyName, email, phone, ownerName, password, officialWebsite, linkedin } = req.body;

    // Check if recruiter exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: "Recruiter already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create recruiter
    const recruiter = await Recruiter.create({
      companyName,
      email,
      phone,
      ownerName,
      password: hashedPassword,
      officialWebsite,
      linkedin,
    });

    // Generate JWT
    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Recruiter account created successfully",
      token,
      recruiter: {
        id: recruiter._id,
        companyName: recruiter.companyName,
        email: recruiter.email,
        ownerName: recruiter.ownerName,
        phone: recruiter.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login recruiter
export const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if recruiter exists
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      recruiter: {
        id: recruiter._id,
        companyName: recruiter.companyName,
        email: recruiter.email,
        ownerName: recruiter.ownerName,
        phone: recruiter.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Validate token
export const validateTokenRoute = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter = await Recruiter.findById(decoded.id).select('-password');
    

    if (!recruiter) {
      return res.status(401).json({ message: "Invalid token" });
    }

    
    res.status(200).json({
      message: "Token is valid",
      recruiter: {
        id: recruiter._id,
        companyName: recruiter.companyName,
        email: recruiter.email,
        ownerName: recruiter.ownerName,
        phone: recruiter.phone,
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};