// routes/authRouter.js
import express from "express";
import { loginRecruiter, signupRecruiter, validateTokenRoute } from "../auth/AuthRegister.js";


const authRouter = express.Router();

// Route: /signup
authRouter.post("/signup", signupRecruiter);

// Route: /login
authRouter.post("/login", loginRecruiter);


//validate Token 

authRouter.get("/validate-token",validateTokenRoute)

export default authRouter;
