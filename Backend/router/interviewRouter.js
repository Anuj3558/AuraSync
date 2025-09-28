import express from 'express';
import {
  getCandidateDetails,
  uploadResumeText,
  startInterview,
  generateQuestion,
  submitAnswer,
  submitAnswerWithState,
  getInterviewResult,
  checkExistingSession,
  resumeInterview,
  saveInterviewState,
  completeInterview,
  getUserInterviews,
  autoSaveInterview
} from '../controller/InterviewController.js';

const InterviewRouter = express.Router();

// Candidate Details Routes
InterviewRouter.get('/users/:userId', getCandidateDetails);
InterviewRouter.get('/candidate/:userId/session', checkExistingSession);

// Resume Upload Routes
InterviewRouter.post('/candidates/upload-resume-text/:userId', uploadResumeText);

// Interview Management Routes
InterviewRouter.post('/interview/start', startInterview);
InterviewRouter.get('/interview/:interviewId/question', generateQuestion);
InterviewRouter.post('/interview/:interviewId/answer', submitAnswerWithState);
InterviewRouter.get('/interview/:interviewId/result', getInterviewResult);

// Session Persistence Routes
InterviewRouter.get('/interview/:interviewId/resume', resumeInterview);
InterviewRouter.post('/interview/:interviewId/save-state', saveInterviewState);
InterviewRouter.post('/interview/:interviewId/complete', completeInterview);
InterviewRouter.post('/interview/:interviewId/auto-save', autoSaveInterview);

// User Interview Routes - Fixed the endpoint paths to match what ChatBox is calling
InterviewRouter.get('/interviews/user/:userId', getUserInterviews);
InterviewRouter.get('/candidate/:userId/interviews', getUserInterviews);

export default InterviewRouter;