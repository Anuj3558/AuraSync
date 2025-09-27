// index.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./connection.js";
import authRouter from "./router/AuthRouter.js";

// Load environment variables
dotenv.config();

const app = express();

// Custom CORS middleware
app.use((req, res, next) => {
  // Allow all origins (specify specific domains in production)
  res.header('Access-Control-Allow-Origin', '*');
  
  // Allow specific headers including Authorization
  res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Allow credentials if needed (set to true if using cookies/auth)
  // res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json());
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from Node.js Backend 🚀");
});

app.use("/api/recruiters", authRouter);

// Example API route
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running", time: new Date().toISOString() });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});