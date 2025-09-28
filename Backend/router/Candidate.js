import express from 'express';
import {
  getRecruiterCandidates,
  getPositionCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate } from "../controller/CandidateController.js"
import { protect } from '../middleware/verifyToken.js';

const CandidateRouter = express.Router();

// All routes are protected

CandidateRouter.get('/recruiter/candidates',protect, getRecruiterCandidates);
CandidateRouter.get('/positions/:jobId/candidates',protect, getPositionCandidates);
CandidateRouter.post('/positions/:jobId/candidates',protect,addCandidate);
CandidateRouter.put('/candidates/:id',protect, updateCandidate);
CandidateRouter.delete('/candidates/:id', deleteCandidate);

export default CandidateRouter;