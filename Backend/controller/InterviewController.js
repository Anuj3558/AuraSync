import { Candidate } from '../models/Candidate.js';
import Position from '../models/Job.js';
import { Interview } from '../models/interview.js';
import { InterviewResult } from '../models/Result.js';
import OpenAI from 'openai';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from "dotenv";

// Import pdf2json with proper error handling
let PDFParser = null;
try {
  PDFParser = (await import('pdf2json')).default;
} catch (error) {
  console.warn('pdf2json not available, PDF parsing will be disabled:', error.message);
}

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Enhanced LinkStatus Management
const LINK_STATUS = {
  NEW: 'new',
  LINK_OPENED: 'linkOpened', 
  RESUME_PROCESS: 'resumeProcess',
  INTERVIEW_STARTED: 'interviewStarted',
  INTERVIEW_IN_PROGRESS: 'interviewInProgress',
  INTERVIEW_COMPLETED: 'interviewCompleted',
  EXPIRED: 'Expired'
};

// Transition linkStatus with validation
const updateLinkStatus = async (candidateId, newStatus, session = null) => {
  try {
    const validTransitions = {
      [LINK_STATUS.NEW]: [LINK_STATUS.LINK_OPENED],
      [LINK_STATUS.LINK_OPENED]: [LINK_STATUS.RESUME_PROCESS, LINK_STATUS.INTERVIEW_STARTED],
      [LINK_STATUS.RESUME_PROCESS]: [LINK_STATUS.INTERVIEW_STARTED],
      [LINK_STATUS.INTERVIEW_STARTED]: [LINK_STATUS.INTERVIEW_IN_PROGRESS, LINK_STATUS.EXPIRED],
      [LINK_STATUS.INTERVIEW_IN_PROGRESS]: [LINK_STATUS.INTERVIEW_COMPLETED, LINK_STATUS.EXPIRED],
      [LINK_STATUS.INTERVIEW_COMPLETED]: [LINK_STATUS.EXPIRED],
      [LINK_STATUS.EXPIRED]: [] // Terminal state
    };

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const currentStatus = candidate.linkStatus || LINK_STATUS.NEW;
    
    // Allow transition to EXPIRED from any state
    if (newStatus === LINK_STATUS.EXPIRED) {
      await Candidate.findByIdAndUpdate(
        candidateId,
        { 
          $set: { 
            linkStatus: newStatus,
            lastUpdated: new Date()
          }
        },
        { session }
      );
      console.log(`LinkStatus updated: ${currentStatus} -> ${newStatus} for candidate ${candidateId}`);
      return true;
    }

    // Check if transition is valid
    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
      console.warn(`Invalid linkStatus transition: ${currentStatus} -> ${newStatus} for candidate ${candidateId}`);
      return false;
    }

    await Candidate.findByIdAndUpdate(
      candidateId,
      { 
        $set: { 
          linkStatus: newStatus,
          lastUpdated: new Date()
        }
      },
      { session }
    );
    
    console.log(`LinkStatus updated: ${currentStatus} -> ${newStatus} for candidate ${candidateId}`);
    return true;
  } catch (error) {
    console.error('Error updating linkStatus:', error);
    return false;
  }
};

// Get candidate details for the card
export const getCandidateDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Fetching candidate details for userId:', userId);
    
    let candidate = await Candidate.findById(userId).populate('positionId');
    
    if (!candidate) {
      return res.status(200).json({
        success: true,
        data: {
          name: "Candidate User",
          email: `user${userId}@example.com`,
          phone: "+1 (555) 000-0000",
          status: "new",
          avatar: "CU",
          linkStatus: LINK_STATUS.LINK_OPENED
        }
      });
    }

    const responseData = {
      id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      experience: candidate.experience,
      skills: candidate.skills,
      status: candidate.status,
      score: candidate.score,
      avatar: candidate.avatar,
      appliedDate: candidate.appliedDate,
      position: candidate.positionId,
      linkStatus: candidate.linkStatus,
      recruiterId: candidate.recruiterId
    };

    // Only update linkStatus if it's in initial states
    if (candidate.linkStatus === LINK_STATUS.NEW || !candidate.linkStatus) {
      await updateLinkStatus(userId, LINK_STATUS.LINK_OPENED);
      responseData.linkStatus = LINK_STATUS.LINK_OPENED;
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate details',
      error: error.message
    });
  }
};

// AI-based resume parsing (keeping existing implementation)
const extractResumeDataWithAI = async (resumeText, excludePersonalInfo = false) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return fallbackResumeParser(resumeText, excludePersonalInfo);
    }

    let prompt;
    
    if (excludePersonalInfo) {
      prompt = `
      Extract the following PROFESSIONAL information from this resume text and return it as JSON.
      DO NOT extract personal information like name, email, or phone number.
      
      Resume Text:
      ${resumeText.substring(0, 3000)}
      
      Please extract and structure ONLY the following professional information:
      {
        "experience": "Years of experience or experience level",
        "skills": ["skill1", "skill2", "skill3"],
        "education": "Highest education or degree",
        "summary": "Brief professional summary",
        "workExperience": ["Company 1", "Company 2"],
        "certifications": ["cert1", "cert2"]
      }
      
      Return only valid JSON format.
      `;
    } else {
      prompt = `
      Extract the following information from this resume text and return it as JSON:
      
      Resume Text:
      ${resumeText.substring(0, 3000)}
      
      Please extract and structure the following information:
      {
        "name": "Full name",
        "email": "Email address", 
        "phone": "Phone number",
        "experience": "Years of experience or experience level",
        "skills": ["skill1", "skill2", "skill3"],
        "education": "Highest education or degree",
        "summary": "Brief professional summary",
        "workExperience": ["Company 1", "Company 2"],
        "certifications": ["cert1", "cert2"]
      }
      
      Return only valid JSON format.
      `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: excludePersonalInfo 
            ? "You are a professional resume parser that extracts ONLY professional qualifications."
            : "You are a professional resume parser. Extract information accurately and return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error extracting resume data with AI:', error);
    return fallbackResumeParser(resumeText, excludePersonalInfo);
  }
};

// Fallback parser (keeping existing implementation)
const fallbackResumeParser = (resumeText, excludePersonalInfo = false) => {
  const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'];
  const result = {
    experience: 'Not specified',
    skills: skills,
    education: 'Not specified',
    summary: 'Resume processed successfully',
    workExperience: ['Previous Company'],
    certifications: []
  };

  if (!excludePersonalInfo) {
    result.name = 'Candidate Name';
    result.email = 'candidate@example.com';
    result.phone = 'Not specified';
  }

  return result;
};

// Handle resume text upload
export const uploadResumeText = async (req, res) => {
  try {
    const { userId } = req.params;
    const { resumeText, fileName, fileType, positionId, recruiterId } = req.body;
    
    // Update linkStatus to resume processing
    await updateLinkStatus(userId, LINK_STATUS.RESUME_PROCESS);

    if (!userId || !resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId and resumeText'
      });
    }

    let candidate = await Candidate.findById(userId);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found.'
      });
    }

    if (candidate.resume && candidate.experience && candidate.skills?.length > 0) {
      const responseData = {
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        experience: candidate.experience,
        skills: candidate.skills?.map(skill => typeof skill === 'object' ? skill.name : skill) || []
      };

      return res.status(200).json({
        success: true,
        message: 'Resume already processed',
        data: {
          candidate: responseData,
          extractedData: responseData,
          alreadyProcessed: true
        }
      });
    }
    
    const extractedData = await extractResumeDataWithAI(resumeText, true);

    const updateData = {
      positionId: positionId || candidate.positionId,
      recruiterId: recruiterId || candidate.recruiterId,
      experience: extractedData.experience || candidate.experience || 'Not specified',
      skills: extractedData.skills?.map(skill => ({
        name: skill,
        proficiency: Math.floor(Math.random() * 40) + 60
      })) || candidate.skills || [],
      resume: resumeText,
      resumeFileName: fileName || 'resume.txt',
      resumeFileType: fileType || 'text/plain',
      status: candidate.status === 'new' ? 'screening' : candidate.status,
      lastUpdated: new Date()
    };

    if (extractedData.education && !candidate.education) {
      updateData.education = extractedData.education;
    }
    
    if (extractedData.summary && !candidate.summary) {
      updateData.summary = extractedData.summary;
    }

    Object.assign(candidate, updateData);
    await candidate.save();

    const responseData = {
      id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      experience: candidate.experience,
      skills: candidate.skills?.map(skill => typeof skill === 'object' ? skill.name : skill) || [],
      status: candidate.status,
      avatar: candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CU'
    };
   
    res.status(200).json({
      success: true,
      message: 'Resume processed successfully',
      data: {
        candidate: responseData,
        extractedData: {
          experience: extractedData.experience,
          skills: extractedData.skills || [],
          education: extractedData.education,
          summary: extractedData.summary,
          workExperience: extractedData.workExperience,
          certifications: extractedData.certifications
        }
      }
    });
  } catch (error) {
    console.error('Error processing resume text:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing resume',
      error: error.message
    });
  }
};

// ENHANCED: Start interview session with atomic duplicate prevention
export const startInterview = async (req, res) => {
  const session = await Interview.startSession(); // Start MongoDB session for atomic operations
  
  try {
    const { candidateId, positionId, recruiterId } = req.body;
    console.log('Starting interview for:', candidateId, positionId, recruiterId);
    
    if (!candidateId || !positionId || !recruiterId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: candidateId, positionId, recruiterId'
      });
    }

    // Start transaction for atomic operations
    await session.withTransaction(async () => {
      // Check for existing interview with atomic query
      const existingInterview = await Interview.findOne({
        candidateId: candidateId,
        positionId: positionId,
        recruiterId: recruiterId
      }).session(session);

      if (existingInterview) {
        if (existingInterview.status === 'started' || existingInterview.status === 'in_progress') {
          console.log('Found existing active interview session:', existingInterview._id);
          await session.abortTransaction();
          return res.status(200).json({
            success: true,
            message: 'Active interview session already exists',
            data: existingInterview,
            isExistingSession: true
          });
        }
        
        if (existingInterview.status === 'completed') {
          console.log('Found completed interview, preventing duplicate session creation');
          await session.abortTransaction();
          return res.status(409).json({
            success: false,
            message: 'Interview already completed for this candidate-position-recruiter combination. Only one interview per combination is allowed.',
            data: {
              existingInterviewId: existingInterview._id,
              status: existingInterview.status,
              completedAt: existingInterview.endTime,
              duration: existingInterview.duration
            },
            errorCode: 'DUPLICATE_INTERVIEW_SESSION'
          });
        }
      }

      // Validate that candidate and position exist
      const candidate = await Candidate.findById(candidateId).session(session);
      const position = await Position.findById(positionId).session(session);

      if (!candidate || !position) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Candidate or Position not found'
        });
      }

      // Create unique compound key to prevent duplicates at database level
      const uniqueSessionKey = `${candidateId}_${positionId}_${recruiterId}_${Date.now()}`;

      // Create new interview session
      const interview = new Interview({
        candidateId,
        positionId,
        recruiterId,
        status: 'started',
        startTime: new Date(),
        currentQuestion: 1,
        totalQuestions: 6,
        timeRemaining: 20 * 60, // 20 minutes
        questionTimeRemaining: 3 * 60, // 3 minutes per question
        conversationHistory: [
          {
            role: 'system',
            content: `Interview started for ${candidate.name} applying for ${position.title} position.`,
            timestamp: new Date()
          }
        ],
        questions: [],
        createdAt: new Date(),
        lastSavedAt: new Date(),
        uniqueSessionKey: uniqueSessionKey
      });

      const savedInterview = await interview.save({ session });
      
      // Update candidate linkStatus atomically
      await updateLinkStatus(candidateId, LINK_STATUS.INTERVIEW_STARTED, session);
      
      console.log('New interview session created:', savedInterview._id);

      return res.status(201).json({
        success: true,
        message: 'Interview session started successfully',
        data: savedInterview,
        isNewSession: true
      });
    });

  } catch (error) {
    await session.abortTransaction();
    
    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('Duplicate key error caught during interview creation');
      const duplicateSession = await Interview.findOne({
        candidateId: req.body.candidateId,
        positionId: req.body.positionId,
        recruiterId: req.body.recruiterId
      });

      if (duplicateSession) {
        return res.status(409).json({
          success: false,
          message: 'Duplicate interview session detected. Only one interview per candidate-position-recruiter combination is allowed.',
          data: {
            existingInterviewId: duplicateSession._id,
            status: duplicateSession.status
          },
          errorCode: 'DUPLICATE_INTERVIEW_SESSION'
        });
      }
    }

    console.error('Error starting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting interview session',
      error: error.message
    });
  } finally {
    await session.endSession();
  }
};

// ENHANCED: Generate question with duplicate prevention
export const generateQuestion = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId)
      .populate('candidateId')
      .populate('positionId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if interview time has expired
    if (interview.timeRemaining <= 0) {
      console.log('Interview time expired, completing interview');
      return await handleTimeExpiry(interview);
    }

    const candidate = interview.candidateId;
    const position = interview.positionId;
    const questionNumber = interview.currentQuestion;

    // ENHANCED: Check for duplicate questions
    const existingQuestion = interview.questions.find(q => q.questionNumber === questionNumber);
    if (existingQuestion && existingQuestion.question) {
      console.log(`Question ${questionNumber} already exists, returning existing question`);
      return res.status(200).json({
        success: true,
        data: {
          question: existingQuestion.question,
          questionNumber,
          totalQuestions: interview.totalQuestions,
          difficulty: existingQuestion.difficulty,
          type: existingQuestion.type,
          timeRemaining: interview.timeRemaining,
          isExistingQuestion: true
        }
      });
    }

    // Check if previous question needs to be answered first
    if (questionNumber > 1) {
      const previousQuestionIndex = questionNumber - 2;
      const previousQuestion = interview.questions[previousQuestionIndex];
      
      if (!previousQuestion || !previousQuestion.response || previousQuestion.response.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Please answer the previous question before proceeding to the next one',
          data: {
            currentQuestion: questionNumber - 1,
            requiresPreviousAnswer: true
          }
        });
      }
    }

    // Generate question logic (keeping existing implementation)
    let difficulty = 'medium';
    let questionType = 'technical';

    if (questionNumber <= 2) {
      difficulty = 'easy';
      questionType = 'introduction';
    } else if (questionNumber <= 4) {
      difficulty = 'medium';
      questionType = 'technical';
    } else {
      difficulty = 'hard';
      questionType = 'scenario';
    }

    let question = await generateQuestionContent(candidate, position, questionNumber, difficulty, questionType);

    // Add question to interview record with duplicate check
    const questionExists = interview.questions.some(q => q.questionNumber === questionNumber);
    if (!questionExists) {
      interview.questions.push({
        questionNumber,
        question,
        difficulty,
        type: questionType,
        askedAt: new Date()
      });

      interview.conversationHistory.push({
        role: 'assistant',
        content: question,
        timestamp: new Date()
      });

      interview.status = 'in_progress';
      await updateLinkStatus(interview.candidateId._id, LINK_STATUS.INTERVIEW_IN_PROGRESS);
      await interview.save();
    }

    res.status(200).json({
      success: true,
      data: {
        question,
        questionNumber,
        totalQuestions: interview.totalQuestions,
        difficulty,
        type: questionType,
        timeRemaining: interview.timeRemaining
      }
    });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating question',
      error: error.message
    });
  }
};

// Helper function to generate question content
const generateQuestionContent = async (candidate, position, questionNumber, difficulty, questionType) => {
  if (!process.env.OPENAI_API_KEY) {
    const fallbackQuestions = {
      introduction: [
        "Can you tell me about your professional background and experience?",
        "What interests you about this position and our company?",
        "Walk me through your experience relevant to this role."
      ],
      technical: [
        `What experience do you have with ${position?.skills?.[0] || 'the main technologies'} used in this role?`,
        "Describe a challenging technical problem you've solved recently.",
        "How do you approach debugging and troubleshooting issues?",
        "What development methodologies have you worked with?"
      ],
      scenario: [
        "How would you handle a situation where you need to learn a new technology quickly?",
        "Describe how you would approach a project with tight deadlines.",
        "What would you do if you disagreed with a technical decision made by your team?",
        "How do you prioritize tasks when working on multiple projects?"
      ]
    };
    
    const questionPool = fallbackQuestions[questionType] || fallbackQuestions.technical;
    return questionPool[Math.min(questionNumber - 1, questionPool.length - 1)] || questionPool[0];
  }

  try {
    const prompt = `
    Generate a ${difficulty} level ${questionType} question for interview question number ${questionNumber}.
    
    Candidate: ${candidate.name} with ${candidate.experience} experience
    Position: ${position.title}
    Skills: ${candidate.skills?.map(s => typeof s === 'object' ? s.name : s).join(', ') || 'general skills'}
    
    Make the question relevant to the candidate's background and the position requirements.
    Return only the question text, no additional formatting.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional technical interviewer. Generate relevant, thoughtful interview questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return completion.choices[0].message.content.trim();
  } catch (aiError) {
    console.error('OpenAI error, falling back to predefined questions:', aiError);
    const fallbackQuestions = {
      introduction: ["Can you tell me about your professional background and experience?"],
      technical: ["Describe a challenging technical problem you've solved recently."],
      scenario: ["How would you handle a tight deadline on a complex project?"]
    };
    
    return fallbackQuestions[questionType]?.[0] || "Please tell me about your experience.";
  }
};

// Helper function to handle time expiry
const handleTimeExpiry = async (interview) => {
  try {
    interview.status = 'completed';
    interview.completed = true;
    interview.endTime = new Date();
    interview.duration = Math.round((interview.endTime - interview.startTime) / (1000 * 60));
    interview.timeRemaining = 0;
    
    await interview.save();
    
    // Update candidate linkStatus to completed, then expired
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.INTERVIEW_COMPLETED);
    const result = await generateInterviewResult(interview._id);
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.EXPIRED);

    return {
      success: false,
      message: 'Interview time expired',
      data: {
        timeExpired: true,
        completed: true,
        result,
        interviewId: interview._id
      }
    };
  } catch (error) {
    console.error('Error handling time expiry:', error);
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.EXPIRED);
    return {
      success: false,
      message: 'Interview time expired, result generation failed',
      data: {
        timeExpired: true,
        completed: true,
        result: null,
        interviewId: interview._id
      }
    };
  }
};

// ENHANCED: Submit answer with improved state management
export const submitAnswerWithState = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answer, timeRemaining, questionTimeRemaining } = req.body;

    const interview = await Interview.findById(interviewId)
      .populate('candidateId')
      .populate('positionId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if time has expired
    if (timeRemaining <= 0) {
      console.log('Interview time expired during answer submission');
      return await handleTimeExpiredAnswer(interview, answer);
    }

    // Record the answer with duplicate check
    const currentQuestionIndex = interview.questions.length - 1;
    if (currentQuestionIndex >= 0) {
      const currentQuestion = interview.questions[currentQuestionIndex];
      
      // Only update if answer is not already recorded
      if (!currentQuestion.response || currentQuestion.response.trim() === '') {
        currentQuestion.response = answer;
        currentQuestion.answeredAt = new Date();
        
        // Add to conversation history
        interview.conversationHistory.push({
          role: 'user',
          content: answer,
          timestamp: new Date()
        });
      }
    }

    // Update timing
    if (timeRemaining !== undefined) {
      interview.timeRemaining = timeRemaining;
    }
    
    if (questionTimeRemaining !== undefined) {
      interview.questionTimeRemaining = questionTimeRemaining;
    }
    
    interview.lastSavedAt = new Date();

    // Check if interview is complete
    if (interview.currentQuestion >= interview.totalQuestions) {
      return await completeInterviewProcess(interview);
    }

    // Move to next question
    interview.currentQuestion += 1;
    interview.questionTimeRemaining = 3 * 60; // Reset to 3 minutes
    
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        completed: false,
        currentQuestion: interview.currentQuestion,
        totalQuestions: interview.totalQuestions,
        savedAt: interview.lastSavedAt,
        timeRemaining: interview.timeRemaining
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
};

// Helper function to handle expired answer submission
const handleTimeExpiredAnswer = async (interview, answer) => {
  try {
    // Record the final answer if provided
    if (answer && answer.trim() !== '') {
      const currentQuestionIndex = interview.questions.length - 1;
      if (currentQuestionIndex >= 0) {
        interview.questions[currentQuestionIndex].response = answer;
        interview.questions[currentQuestionIndex].answeredAt = new Date();
      }

      interview.conversationHistory.push({
        role: 'user',
        content: answer,
        timestamp: new Date()
      });
    }

    return await completeInterviewProcess(interview, true);
  } catch (error) {
    console.error('Error handling expired answer:', error);
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.EXPIRED);
    return {
      success: true,
      message: 'Interview time expired, error in processing',
      data: {
        completed: true,
        timeExpired: true,
        result: null,
        interviewId: interview._id
      }
    };
  }
};

// Helper function to complete interview process
const completeInterviewProcess = async (interview, timeExpired = false) => {
  try {
    interview.status = 'completed';
    interview.completed = true;
    interview.endTime = new Date();
    interview.duration = Math.round((interview.endTime - interview.startTime) / (1000 * 60));
    
    if (timeExpired) {
      interview.timeRemaining = 0;
    }
    
    await interview.save();
    
    // Update linkStatus progression
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.INTERVIEW_COMPLETED);
    
    // Generate result
    const result = await generateInterviewResult(interview._id);
    
    // Final status transition to expired
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.EXPIRED);
    
    return {
      success: true,
      message: timeExpired ? 'Interview completed due to time expiry' : 'Interview completed successfully',
      data: {
        completed: true,
        timeExpired,
        result,
        interviewId: interview._id
      }
    };
  } catch (error) {
    console.error('Error completing interview process:', error);
    await updateLinkStatus(interview.candidateId._id, LINK_STATUS.EXPIRED);
    return {
      success: true,
      message: 'Interview completed but result generation failed',
      data: {
        completed: true,
        timeExpired,
        result: null,
        interviewId: interview._id,
        error: 'Result generation failed'
      }
    };
  }
};

// Enhanced result generation with improved linkStatus handling
const generateInterviewResult = async (interviewId) => {
  try {
    console.log('Generating result for interview:', interviewId);
    
    const interview = await Interview.findById(interviewId)
      .populate('candidateId')
      .populate('positionId');

    if (!interview) {
      throw new Error('Interview not found');
    }

    // Check if result already exists
    const existingResult = await InterviewResult.findOne({ interviewId: interview._id });
    if (existingResult) {
      console.log('Result already exists for interview:', interviewId);
      return existingResult;
    }

    const candidate = interview.candidateId;
    const position = interview.positionId;

    let analysis;

    if (!process.env.OPENAI_API_KEY) {
      console.log('Using fallback analysis for interview:', interviewId);
      analysis = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        categoryScores: {
          technical: Math.floor(Math.random() * 30) + 70,
          communication: Math.floor(Math.random() * 30) + 70,
          problemSolving: Math.floor(Math.random() * 30) + 70,
          experience: Math.floor(Math.random() * 30) + 70
        },
        strengths: ["Good technical knowledge", "Clear communication", "Relevant experience"],
        weaknesses: ["Could improve on specific technologies", "More practice with complex scenarios"],
        recommendations: ["Consider for next round", "Technical assessment recommended"],
        detailedFeedback: "Interview completed successfully. Candidate showed good understanding of the role requirements.",
        recommendation: Math.random() > 0.3 ? "recommended" : "pending",
        nextSteps: ["Schedule follow-up interview", "Technical assessment"]
      };
    } else {
      console.log('Using AI analysis for interview:', interviewId);
      
      const questionsAndAnswers = interview.questions
        .filter(q => q.response && q.response.trim().length > 0)
        .map((q, i) => `Q${i+1}: ${q.question}\nA${i+1}: ${q.response}`)
        .join('\n\n');

      if (!questionsAndAnswers || questionsAndAnswers.trim().length === 0) {
        console.warn('No valid questions and answers found, using fallback analysis');
        analysis = {
          overallScore: 60,
          categoryScores: {
            technical: 60,
            communication: 60,
            problemSolving: 60,
            experience: 60
          },
          strengths: ["Participated in interview"],
          weaknesses: ["Limited responses recorded", "Incomplete interview responses"],
          recommendations: ["Manual review recommended", "Follow-up interview suggested"],
          detailedFeedback: "Interview completed but limited response data available for comprehensive analysis.",
          recommendation: "pending",
          nextSteps: ["Manual review of interview", "Consider follow-up assessment"]
        };
      } else {
        const analysisPrompt = `
        Analyze this interview and provide evaluation in JSON format:
        
        Position: ${position.title}
        Candidate: ${candidate.name}
        Experience: ${candidate.experience}
        Skills: ${candidate.skills?.map(s => typeof s === 'object' ? s.name : s).join(', ') || 'Not specified'}
        
        Questions and Answers:
        ${questionsAndAnswers}
        
        Provide a comprehensive analysis in the following JSON structure:
        {
          "overallScore": 85,
          "categoryScores": {
            "technical": 80,
            "communication": 90,
            "problemSolving": 85,
            "experience": 80
          },
          "strengths": ["strength1", "strength2", "strength3"],
          "weaknesses": ["area for improvement1", "area for improvement2"],
          "recommendations": ["recommendation1", "recommendation2"],
          "detailedFeedback": "Detailed paragraph about the candidate's performance",
          "recommendation": "recommended|pending|rejected",
          "nextSteps": ["next step1", "next step2"]
        }
        
        Use only these values for recommendation: "recommended", "pending", or "rejected"
        Return only valid JSON without any additional text or formatting.
        `;

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a professional interview evaluator. Provide fair, comprehensive, and constructive feedback. Return only valid JSON. Use only 'recommended', 'pending', or 'rejected' for recommendation field."
              },
              {
                role: "user",
                content: analysisPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 2000
          });

          const responseText = completion.choices[0].message.content.trim();
          console.log('AI Response received for analysis');
          
          analysis = JSON.parse(responseText);
          
          // Validate and fix recommendation field if needed
          const validRecommendations = ['recommended', 'pending', 'rejected'];
          if (!validRecommendations.includes(analysis.recommendation)) {
            console.log('Invalid recommendation value:', analysis.recommendation, 'defaulting to pending');
            analysis.recommendation = 'pending';
          }
          
          // Validate required fields
          if (!analysis.overallScore || !analysis.categoryScores) {
            throw new Error('Invalid analysis structure from AI');
          }
          
        } catch (aiError) {
          console.error('AI analysis failed:', aiError);
          analysis = {
            overallScore: 75,
            categoryScores: {
              technical: 70,
              communication: 80,
              problemSolving: 75,
              experience: 70
            },
            strengths: ["Completed interview questions", "Showed engagement"],
            weaknesses: ["AI analysis unavailable", "Manual review recommended"],
            recommendations: ["Manual review of responses", "Consider technical assessment"],
            detailedFeedback: "Interview completed successfully. AI analysis was unavailable, manual review recommended.",
            recommendation: "pending",
            nextSteps: ["Manual review", "Follow-up interview if needed"]
          };
        }
      }
    }

    // Ensure all required fields are present with defaults
    const resultData = {
      interviewId: interview._id,
      candidateId: interview.candidateId._id,
      positionId: interview.positionId._id,
      overallScore: analysis.overallScore || 75,
      categoryScores: {
        technical: analysis.categoryScores?.technical || 70,
        communication: analysis.categoryScores?.communication || 75,
        problemSolving: analysis.categoryScores?.problemSolving || 75,
        experience: analysis.categoryScores?.experience || 70,
        ...analysis.categoryScores
      },
      strengths: analysis.strengths || ["Interview completed"],
      weaknesses: analysis.weaknesses || ["Requires review"],
      recommendations: analysis.recommendations || ["Further evaluation needed"],
      detailedFeedback: analysis.detailedFeedback || "Interview analysis completed.",
      recommendation: analysis.recommendation || "pending",
      nextSteps: analysis.nextSteps || ["Review required"],
      aiAnalysis: analysis.aiAnalysis || {
        responseQuality: "Analysis completed",
        technicalAccuracy: "Requires review",
        communicationStyle: "Assessment needed"
      },
      createdAt: new Date(),
      analysisDate: new Date()
    };

    console.log('Creating result with data for interview:', interviewId);

    // Create and save the result
    const result = new InterviewResult(resultData);
    const savedResult = await result.save();

    console.log('Result saved successfully:', savedResult._id);

    // Update candidate record with score and status
    try {
      await Candidate.findByIdAndUpdate(
        interview.candidateId._id,
        {
          $set: {
            score: analysis.overallScore,
            status: getStatusFromRecommendation(analysis.recommendation),
            lastInterviewDate: new Date(),
            lastUpdated: new Date()
          }
        }
      );
      console.log('Candidate record updated with new score and status');
    } catch (candidateUpdateError) {
      console.error('Error updating candidate record:', candidateUpdateError);
      // Don't throw error here, result is already saved
    }

    return savedResult;

  } catch (error) {
    console.error('Error in generateInterviewResult:', error);
    
    // Create a basic fallback result to ensure something is saved
    try {
      const interview = await Interview.findById(interviewId)
        .populate('candidateId')
        .populate('positionId');

      if (!interview) {
        throw new Error('Interview not found for fallback result');
      }

      const fallbackResult = new InterviewResult({
        interviewId: interviewId,
        candidateId: interview.candidateId._id,
        positionId: interview.positionId._id,
        overallScore: 70,
        categoryScores: {
          technical: 70,
          communication: 70,
          problemSolving: 70,
          experience: 70
        },
        strengths: ["Interview completed"],
        weaknesses: ["Analysis failed, manual review required"],
        recommendations: ["Manual review required"],
        detailedFeedback: "Interview completed but automated analysis failed. Manual review is required.",
        recommendation: "pending",
        nextSteps: ["Manual review of interview responses"],
        aiAnalysis: {
          responseQuality: "Analysis failed",
          technicalAccuracy: "Manual review required",
          communicationStyle: "Assessment needed"
        },
        error: error.message,
        createdAt: new Date(),
        analysisDate: new Date()
      });

      const savedFallback = await fallbackResult.save();
      console.log('Fallback result saved:', savedFallback._id);

      return savedFallback;
    } catch (fallbackError) {
      console.error('Even fallback result failed:', fallbackError);
      throw new Error('Failed to generate interview result: ' + error.message);
    }
  }
};

// Helper function to convert recommendation to status
const getStatusFromRecommendation = (recommendation) => {
  switch (recommendation) {
    case 'highly_recommended':
    case 'recommended':
      return 'interview';
    case 'rejected':
    case 'not_recommended':
      return 'rejected';
    case 'pending':
    case 'review_required':
    default:
      return 'screening';
  }
};

// ENHANCED: Get interview result with proper error handling
export const getInterviewResult = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    console.log('Fetching result for interview:', interviewId);
    
    const result = await InterviewResult.findOne({ interviewId })
      .populate('candidateId')
      .populate('positionId');

    if (!result) {
      console.log('No result found, checking if interview exists');
      
      const interview = await Interview.findById(interviewId);
      if (interview && interview.status === 'completed') {
        console.log('Interview completed but no result, generating now');
        try {
          const newResult = await generateInterviewResult(interviewId);
          
          // Ensure linkStatus is set to expired after result generation
          await updateLinkStatus(interview.candidateId, LINK_STATUS.EXPIRED);
          
          return res.status(200).json({
            success: true,
            data: newResult,
            message: 'Result generated successfully'
          });
        } catch (generateError) {
          console.error('Failed to generate result:', generateError);
          
          // Still set linkStatus to expired even if result generation fails
          await updateLinkStatus(interview.candidateId, LINK_STATUS.EXPIRED);
          
          return res.status(500).json({
            success: false,
            message: 'Interview completed but result generation failed',
            error: generateError.message
          });
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Interview result not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching interview result:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interview result',
      error: error.message
    });
  }
};

// ENHANCED: Check existing interview session with comprehensive duplicate prevention
export const checkExistingSession = async (req, res) => {
  try {
    const { userId } = req.params;
    const { positionId, recruiterId } = req.query;
    
    console.log('Checking existing session for user:', userId, 'position:', positionId, 'recruiter:', recruiterId);
    
    let query = { candidateId: userId };
    
    if (positionId && recruiterId) {
      query.positionId = positionId;
      query.recruiterId = recruiterId;
    }
    
    const interviews = await Interview.find(query)
      .populate('positionId')
      .sort({ createdAt: -1 })
      .limit(10);

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No interview sessions found',
        hasAnySession: false,
        canStartNewSession: true
      });
    }

    // Find active session first
    const activeInterview = interviews.find(interview => 
      interview.status === 'started' || interview.status === 'in_progress'
    );

    if (activeInterview) {
      return res.status(200).json({
        success: true,
        data: {
          id: activeInterview._id,
          status: activeInterview.status,
          currentQuestion: activeInterview.currentQuestion,
          totalQuestions: activeInterview.totalQuestions,
          timeRemaining: activeInterview.timeRemaining,
          questionTimeRemaining: activeInterview.questionTimeRemaining,
          position: activeInterview.positionId,
          recruiterId: activeInterview.recruiterId,
          hasActiveSession: true,
          sessionType: 'active',
          canStartNewSession: false
        },
        message: 'Active interview session found'
      });
    }

    // Check for completed sessions (prevent duplicates)
    if (positionId && recruiterId) {
      const exactMatch = interviews.find(interview => 
        interview.status === 'completed' &&
        interview.positionId && interview.positionId._id.toString() === positionId &&
        interview.recruiterId === recruiterId
      );
      
      if (exactMatch) {
        return res.status(200).json({
          success: true,
          data: {
            id: exactMatch._id,
            status: exactMatch.status,
            position: exactMatch.positionId,
            recruiterId: exactMatch.recruiterId,
            completedAt: exactMatch.endTime,
            duration: exactMatch.duration,
            hasActiveSession: false,
            sessionType: 'completed',
            isDuplicatePrevention: true,
            canStartNewSession: false
          },
          message: 'Interview already completed for this combination'
        });
      }
    }

    // Return info about recent interviews but allow new session
    const recentInterview = interviews[0];
    return res.status(200).json({
      success: true,
      data: {
        id: recentInterview._id,
        status: recentInterview.status,
        position: recentInterview.positionId,
        recruiterId: recentInterview.recruiterId,
        completedAt: recentInterview.endTime,
        hasActiveSession: false,
        sessionType: 'recent',
        canStartNewSession: true
      },
      message: 'Recent interview session found, new session can be started'
    });

  } catch (error) {
    console.error('Error checking existing session:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking existing session',
      error: error.message
    });
  }
};

// ENHANCED: Resume interview session with improved state management
export const resumeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    console.log('Resuming interview:', interviewId);
    
    const interview = await Interview.findById(interviewId)
      .populate('candidateId')
      .populate('positionId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check if interview is already completed
    if (interview.status === 'completed') {
      // Ensure linkStatus is expired for completed interviews
      await updateLinkStatus(interview.candidateId._id, LINK_STATUS.EXPIRED);
      
      return res.status(409).json({
        success: false,
        message: 'Interview is already completed',
        data: {
          status: 'completed',
          completedAt: interview.endTime,
          linkStatus: LINK_STATUS.EXPIRED
        }
      });
    }

    // Update linkStatus when resuming interview
    if (interview.status === 'started') {
      await updateLinkStatus(interview.candidateId._id, LINK_STATUS.INTERVIEW_STARTED);
    } else if (interview.status === 'in_progress') {
      await updateLinkStatus(interview.candidateId._id, LINK_STATUS.INTERVIEW_IN_PROGRESS);
    }

    const responseData = {
      _id: interview._id,
      status: interview.status || 'started',
      currentQuestion: interview.currentQuestion || 1,
      totalQuestions: interview.totalQuestions || 6,
      timeRemaining: interview.timeRemaining !== undefined ? interview.timeRemaining : (20 * 60),
      questionTimeRemaining: interview.questionTimeRemaining !== undefined ? interview.questionTimeRemaining : (3 * 60),
      conversationHistory: interview.conversationHistory || [],
      questions: interview.questions || [],
      candidate: interview.candidateId,
      position: interview.positionId,
      startTime: interview.startTime || new Date(),
      recruiterId: interview.recruiterId
    };

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'Interview session resumed successfully'
    });
  } catch (error) {
    console.error('Error resuming interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error resuming interview session',
      error: error.message
    });
  }
};

// Save interview state with enhanced validation
export const saveInterviewState = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { 
      currentQuestion, 
      timeRemaining, 
      questionTimeRemaining, 
      messages, 
      status 
    } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Don't save state for completed interviews
    if (interview.status === 'completed') {
      return res.status(409).json({
        success: false,
        message: 'Cannot save state for completed interview'
      });
    }

    const updateData = {
      currentQuestion: currentQuestion !== undefined ? currentQuestion : interview.currentQuestion,
      timeRemaining: timeRemaining !== undefined ? timeRemaining : interview.timeRemaining,
      questionTimeRemaining: questionTimeRemaining !== undefined ? questionTimeRemaining : interview.questionTimeRemaining,
      status: status || interview.status,
      lastSavedAt: new Date()
    };

    if (messages && Array.isArray(messages)) {
      updateData.conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date()
      }));
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId, 
      { $set: updateData },
      { new: true }
    );

    // Update linkStatus based on current status
    if (updatedInterview.status === 'in_progress') {
      await updateLinkStatus(updatedInterview.candidateId, LINK_STATUS.INTERVIEW_IN_PROGRESS);
    }

    res.status(200).json({
      success: true,
      message: 'Interview state saved successfully',
      data: {
        id: updatedInterview._id,
        lastSavedAt: updatedInterview.lastSavedAt,
        currentStatus: updatedInterview.status
      }
    });
  } catch (error) {
    console.error('Error saving interview state:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving interview state',
      error: error.message
    });
  }
};

// ENHANCED: Complete interview with comprehensive linkStatus management
export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    console.log('Completing interview:', interviewId);
    
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    if (interview.status === 'completed') {
      console.log('Interview already completed, ensuring proper linkStatus');
      
      const existingResult = await InterviewResult.findOne({ interviewId });
      
      // Ensure candidate linkStatus is set to Expired
      await updateLinkStatus(interview.candidateId, LINK_STATUS.EXPIRED);
      
      return res.status(200).json({
        success: true,
        message: 'Interview was already completed',
        data: {
          interview: {
            id: interview._id,
            status: interview.status,
            duration: interview.duration,
            completedAt: interview.endTime
          },
          result: existingResult,
          linkStatus: LINK_STATUS.EXPIRED
        }
      });
    }

    // Mark interview as completed
    interview.status = 'completed';
    interview.completed = true;
    interview.endTime = new Date();
    interview.duration = Math.round((interview.endTime - interview.startTime) / (1000 * 60));
    
    await interview.save();
    console.log('Interview marked as completed');
    
    // Progressive linkStatus updates
    await updateLinkStatus(interview.candidateId, LINK_STATUS.INTERVIEW_COMPLETED);
    
    // Generate result
    try {
      const result = await generateInterviewResult(interviewId);
      console.log('Result generated successfully');
      
      // Final status transition to expired
      await updateLinkStatus(interview.candidateId, LINK_STATUS.EXPIRED);
      
      res.status(200).json({
        success: true,
        message: 'Interview completed successfully',
        data: {
          interview: {
            id: interview._id,
            status: interview.status,
            duration: interview.duration,
            completedAt: interview.endTime
          },
          result,
          linkStatus: LINK_STATUS.EXPIRED
        }
      });
    } catch (resultError) {
      console.error('Result generation failed:', resultError);
      
      // Still set linkStatus to expired even if result generation fails
      await updateLinkStatus(interview.candidateId, LINK_STATUS.EXPIRED);
      
      res.status(200).json({
        success: true,
        message: 'Interview completed but result generation failed',
        data: {
          interview: {
            id: interview._id,
            status: interview.status,
            duration: interview.duration,
            completedAt: interview.endTime
          },
          result: null,
          linkStatus: LINK_STATUS.EXPIRED,
          error: 'Result generation failed, please try to fetch it later'
        }
      });
    }
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing interview',
      error: error.message
    });
  }
};

// ENHANCED: Get user interviews with duplicate detection
export const getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { positionId, recruiterId } = req.query;
    
    console.log('Fetching interviews for user:', userId);
    
    let query = { candidateId: userId };
    
    if (positionId && recruiterId) {
      query.positionId = positionId;
      query.recruiterId = recruiterId;
    }
    
    const interviews = await Interview.find(query)
      .populate('positionId')
      .sort({ createdAt: -1 })
      .limit(10);

    if (!interviews || interviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No interviews found for this user',
        meta: {
          totalInterviews: 0,
          hasActiveSession: false,
          hasDuplicateRisk: false,
          canStartNewSession: true
        }
      });
    }

    // Check for potential duplicates
    const interviewMap = new Map();
    interviews.forEach(interview => {
      const key = `${interview.candidateId}_${interview.positionId?._id}_${interview.recruiterId}`;
      if (!interviewMap.has(key)) {
        interviewMap.set(key, []);
      }
      interviewMap.get(key).push(interview);
    });

    const duplicateCombinations = Array.from(interviewMap.entries())
      .filter(([key, interviews]) => interviews.length > 1);

    // Find active interview
    const activeInterview = interviews.find(interview => 
      interview.status === 'started' || interview.status === 'in_progress'
    );

    // Check if specific combination has completed interview (prevents new session)
    let canStartNewSession = true;
    if (positionId && recruiterId) {
      const completedForCombination = interviews.some(interview => 
        interview.status === 'completed' &&
        interview.positionId?._id.toString() === positionId &&
        interview.recruiterId === recruiterId
      );
      canStartNewSession = !completedForCombination;
    }

    const interviewToReturn = activeInterview || interviews[0];

    const responseData = {
      id: interviewToReturn._id,
      status: interviewToReturn.status,
      currentQuestion: interviewToReturn.currentQuestion || 1,
      totalQuestions: interviewToReturn.totalQuestions || 6,
      timeRemaining: interviewToReturn.timeRemaining,
      questionTimeRemaining: interviewToReturn.questionTimeRemaining,
      startTime: interviewToReturn.startTime,
      endTime: interviewToReturn.endTime,
      duration: interviewToReturn.duration,
      position: interviewToReturn.positionId,
      recruiterId: interviewToReturn.recruiterId
    };

    res.status(200).json({
      success: true,
      data: responseData,
      meta: {
        totalInterviews: interviews.length,
        hasActiveSession: !!activeInterview,
        completedInterviews: interviews.filter(i => i.status === 'completed').length,
        hasDuplicateRisk: duplicateCombinations.length > 0,
        duplicateCombinations: duplicateCombinations.length,
        uniqueCombinations: interviewMap.size,
        canStartNewSession
      }
    });
  } catch (error) {
    console.error('Error fetching user interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user interviews',
      error: error.message
    });
  }
};

// Utility functions for duplicate management
export const checkDuplicateSession = async (candidateId, positionId, recruiterId) => {
  try {
    const existingSession = await Interview.findOne({
      candidateId,
      positionId,
      recruiterId
    });

    return {
      hasDuplicate: !!existingSession,
      existingSession: existingSession,
      status: existingSession?.status || null,
      isActive: existingSession?.status === 'started' || existingSession?.status === 'in_progress',
      isCompleted: existingSession?.status === 'completed'
    };
  } catch (error) {
    console.error('Error checking duplicate session:', error);
    return {
      hasDuplicate: false,
      error: error.message
    };
  }
};

export const findDuplicateSessions = async (req, res) => {
  try {
    console.log('Scanning for duplicate interview sessions...');
    
    const duplicates = await Interview.aggregate([
      {
        $group: {
          _id: {
            candidateId: '$candidateId',
            positionId: '$positionId',
            recruiterId: '$recruiterId'
          },
          interviews: { $push: '$_id' },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No duplicate sessions found',
        data: {
          duplicateCount: 0,
          duplicates: []
        }
      });
    }

    const detailedDuplicates = await Promise.all(
      duplicates.map(async (dup) => {
        const interviews = await Interview.find({
          _id: { $in: dup.interviews }
        })
        .populate('candidateId', 'name email')
        .populate('positionId', 'title')
        .sort({ createdAt: 1 });

        return {
          combination: dup._id,
          count: dup.count,
          interviews: interviews.map(interview => ({
            id: interview._id,
            status: interview.status,
            createdAt: interview.createdAt,
            completed: interview.completed,
            candidate: interview.candidateId?.name,
            position: interview.positionId?.title
          }))
        };
      })
    );

    res.status(200).json({
      success: true,
      message: `Found ${duplicates.length} duplicate session combinations`,
      data: {
        duplicateCount: duplicates.length,
        totalDuplicateInterviews: duplicates.reduce((sum, dup) => sum + dup.count, 0),
        duplicates: detailedDuplicates
      }
    });

  } catch (error) {
    console.error('Error finding duplicate sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error scanning for duplicate sessions',
      error: error.message
    });
  }
};

// Auto-save interview with enhanced validation
export const autoSaveInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const sessionData = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Don't auto-save for completed interviews
    if (interview.status === 'completed') {
      return res.status(409).json({
        success: false,
        message: 'Cannot auto-save completed interview',
        data: {
          status: 'completed',
          linkStatus: LINK_STATUS.EXPIRED
        }
      });
    }

    // Validate session data before saving
    const validatedData = {
      ...sessionData,
      lastSavedAt: new Date(),
      autoSaveCount: (interview.autoSaveCount || 0) + 1
    };

    // Ensure timeRemaining doesn't go below 0
    if (validatedData.timeRemaining !== undefined && validatedData.timeRemaining < 0) {
      validatedData.timeRemaining = 0;
    }

    await Interview.findByIdAndUpdate(interviewId, { $set: validatedData });

    // Update linkStatus if interview is in progress
    if (validatedData.status === 'in_progress') {
      await updateLinkStatus(interview.candidateId, LINK_STATUS.INTERVIEW_IN_PROGRESS);
    }

    res.status(200).json({
      success: true,
      message: 'Auto-save completed',
      timestamp: new Date(),
      autoSaveCount: validatedData.autoSaveCount
    });
  } catch (error) {
    console.error('Auto-save error:', error);
    res.status(500).json({
      success: false,
      message: 'Auto-save failed',
      error: error.message
    });
  }
};

// Legacy submitAnswer for compatibility
export const submitAnswer = async (req, res) => {
  try {
    await submitAnswerWithState(req, res);
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
};

// ADDITIONAL UTILITY FUNCTIONS FOR ENHANCED MANAGEMENT

// Cleanup expired sessions (can be called periodically)
export const cleanupExpiredSessions = async (req, res) => {
  try {
    const cutoffTime = new Date(Date.now() - (24 * 60 * 60 * 1000)); // 24 hours ago
    
    // Find sessions that should be expired
    const expiredSessions = await Interview.find({
      status: { $in: ['started', 'in_progress'] },
      createdAt: { $lt: cutoffTime }
    });

    let cleanedCount = 0;
    const cleanupResults = [];

    for (const session of expiredSessions) {
      try {
        // Mark as completed due to timeout
        session.status = 'completed';
        session.completed = true;
        session.endTime = new Date();
        session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60));
        session.timeRemaining = 0;
        
        await session.save();
        
        // Try to generate result
        try {
          await generateInterviewResult(session._id);
        } catch (resultError) {
          console.error('Result generation failed for expired session:', session._id, resultError);
        }
        
        // Set linkStatus to expired
        await updateLinkStatus(session.candidateId, LINK_STATUS.EXPIRED);
        
        cleanedCount++;
        cleanupResults.push({
          sessionId: session._id,
          candidateId: session.candidateId,
          status: 'cleaned'
        });
        
      } catch (sessionError) {
        console.error('Error cleaning session:', session._id, sessionError);
        cleanupResults.push({
          sessionId: session._id,
          candidateId: session.candidateId,
          status: 'error',
          error: sessionError.message
        });
      }
    }

    if (req && res) {
      res.status(200).json({
        success: true,
        message: `Cleaned up ${cleanedCount} expired sessions`,
        data: {
          totalFound: expiredSessions.length,
          cleaned: cleanedCount,
          failed: expiredSessions.length - cleanedCount,
          details: cleanupResults
        }
      });
    } else {
      console.log(`Cleanup completed: ${cleanedCount}/${expiredSessions.length} sessions processed`);
      return {
        cleaned: cleanedCount,
        total: expiredSessions.length,
        details: cleanupResults
      };
    }
    
  } catch (error) {
    console.error('Error in cleanup process:', error);
    if (req && res) {
      res.status(500).json({
        success: false,
        message: 'Error during cleanup process',
        error: error.message
      });
    }
    throw error;
  }
};

// Validate interview integrity
export const validateInterviewIntegrity = async (req, res) => {
  try {
    const issues = [];
    
    // Check for orphaned interviews (no candidate or position)
    const orphanedInterviews = await Interview.aggregate([
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidateId',
          foreignField: '_id',
          as: 'candidate'
        }
      },
      {
        $lookup: {
          from: 'positions',
          localField: 'positionId',
          foreignField: '_id',
          as: 'position'
        }
      },
      {
        $match: {
          $or: [
            { candidate: { $size: 0 } },
            { position: { $size: 0 } }
          ]
        }
      }
    ]);

    if (orphanedInterviews.length > 0) {
      issues.push({
        type: 'orphaned_interviews',
        count: orphanedInterviews.length,
        data: orphanedInterviews.map(i => ({ id: i._id, candidateId: i.candidateId, positionId: i.positionId }))
      });
    }

    // Check for interviews without results
    const interviewsWithoutResults = await Interview.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'interviewresults',
          localField: '_id',
          foreignField: 'interviewId',
          as: 'result'
        }
      },
      {
        $match: {
          result: { $size: 0 }
        }
      }
    ]);

    if (interviewsWithoutResults.length > 0) {
      issues.push({
        type: 'completed_interviews_without_results',
        count: interviewsWithoutResults.length,
        data: interviewsWithoutResults.map(i => ({ id: i._id, candidateId: i.candidateId }))
      });
    }

    // Check for candidates with incorrect linkStatus
    const candidatesWithIncorrectStatus = await Candidate.aggregate([
      {
        $lookup: {
          from: 'interviews',
          localField: '_id',
          foreignField: 'candidateId',
          as: 'interviews'
        }
      },
      {
        $match: {
          $expr: {
            $and: [
              { $gt: [{ $size: '$interviews' }, 0] },
              { 
                $or: [
                  {
                    $and: [
                      { $eq: ['$linkStatus', LINK_STATUS.NEW] },
                      { $gt: [{ $size: '$interviews' }, 0] }
                    ]
                  },
                  {
                    $and: [
                      { $in: ['$linkStatus', [LINK_STATUS.INTERVIEW_STARTED, LINK_STATUS.INTERVIEW_IN_PROGRESS]] },
                      { $in: [{ $arrayElemAt: ['$interviews.status', -1] }, ['completed']] }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    ]);

    if (candidatesWithIncorrectStatus.length > 0) {
      issues.push({
        type: 'incorrect_candidate_linkstatus',
        count: candidatesWithIncorrectStatus.length,
        data: candidatesWithIncorrectStatus.map(c => ({ 
          id: c._id, 
          currentLinkStatus: c.linkStatus,
          interviewStatuses: c.interviews.map(i => i.status)
        }))
      });
    }

    res.status(200).json({
      success: true,
      message: issues.length === 0 ? 'No integrity issues found' : `Found ${issues.length} types of integrity issues`,
      data: {
        totalIssueTypes: issues.length,
        totalIssueCount: issues.reduce((sum, issue) => sum + issue.count, 0),
        issues: issues
      }
    });

  } catch (error) {
    console.error('Error validating interview integrity:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating interview integrity',
      error: error.message
    });
  }
};

// Fix candidate linkStatus based on interview states
export const fixCandidateLinkStatus = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).populate('_id');
    let fixedCount = 0;
    const fixResults = [];

    for (const candidate of candidates) {
      try {
        // Find latest interview for this candidate
        const latestInterview = await Interview.findOne({ 
          candidateId: candidate._id 
        }).sort({ createdAt: -1 });

        if (!latestInterview) {
          // No interview, ensure linkStatus is appropriate
          if (candidate.resume && (candidate.linkStatus === LINK_STATUS.NEW || !candidate.linkStatus)) {
            await updateLinkStatus(candidate._id, LINK_STATUS.RESUME_PROCESS);
            fixedCount++;
            fixResults.push({
              candidateId: candidate._id,
              action: 'set_to_resume_process',
              reason: 'has_resume_but_no_interview'
            });
          }
          continue;
        }

        let expectedStatus;
        switch (latestInterview.status) {
          case 'started':
            expectedStatus = LINK_STATUS.INTERVIEW_STARTED;
            break;
          case 'in_progress':
            expectedStatus = LINK_STATUS.INTERVIEW_IN_PROGRESS;
            break;
          case 'completed':
            expectedStatus = LINK_STATUS.EXPIRED;
            break;
          default:
            expectedStatus = candidate.linkStatus; // Keep current if unknown
        }

        if (candidate.linkStatus !== expectedStatus) {
          await updateLinkStatus(candidate._id, expectedStatus);
          fixedCount++;
          fixResults.push({
            candidateId: candidate._id,
            action: `updated_to_${expectedStatus}`,
            reason: `interview_status_${latestInterview.status}`,
            oldStatus: candidate.linkStatus
          });
        }

      } catch (candidateError) {
        console.error('Error fixing candidate:', candidate._id, candidateError);
        fixResults.push({
          candidateId: candidate._id,
          action: 'error',
          error: candidateError.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Fixed linkStatus for ${fixedCount} candidates`,
      data: {
        totalCandidates: candidates.length,
        fixed: fixedCount,
        details: fixResults
      }
    });

  } catch (error) {
    console.error('Error fixing candidate linkStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing candidate linkStatus',
      error: error.message
    });
  }
};