import { Candidate } from '../models/Candidate.js';
import Position from '../models/Job.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { protect } from '../middleware/verifyToken.js';
import { InterviewResult } from '../models/Result.js';
import { Interview } from '../models/interview.js';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Email credentials missing in environment variables');
}

// Email transporter configuration with better Gmail setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "anujloharkar3557@gmail.com",
    pass: "elzk fldy nafq dtlk" // This should be an App Password
  },
  // Add these for better Gmail compatibility
  
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Get all candidates for a recruiter with position details
export const getRecruiterCandidates = async (req, res) => {
  try {
    
    const recruiterId = req.user.id;
    console.log('Fetching candidates for recruiter:', recruiterId);
    const candidates = await Candidate.find({ recruiterId })
      .populate('positionId', 'title company location')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      data: candidates,
      count: candidates.length
    });
  } catch (error) {
    console.error('Error fetching recruiter candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates'
    });
  }
};

// Get all candidates for a specific position
export const getPositionCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;
    
    // Verify the position belongs to the recruiter
    const position = await Position.findOne({ 
      _id: new mongoose.Types.ObjectId(jobId), 
      recruiter: recruiterId 
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    // Fetch candidates for this position
    const candidates = await Candidate.find({ positionId: jobId }).lean();
    
    // Enrich candidates with interview and result data
    const enrichedCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        try {
          // Find ALL interviews for this candidate (not just latest)
          const interviews = await Interview.find({ 
            candidateId: candidate._id 
          })
          .sort({ createdAt: -1 })
          .lean();

          const latestInterview = interviews[0] || null;

          // Find interview results for ALL interviews
          const interviewResults = await InterviewResult.find({ 
            candidateId: candidate._id 
          })
          .sort({ createdAt: -1 })
          .lean();

          const latestInterviewResult = interviewResults[0] || null;

          // Format chat history from ALL interviews
          let chatHistory = [];
          interviews.forEach(interview => {
            if (interview.conversationHistory) {
              const interviewChats = interview.conversationHistory.map(msg => ({
                sender: msg.role === 'assistant' ? 'AI' : 'User',
                message: msg.content,
                timestamp: msg.timestamp,
                interviewId: interview._id,
                interviewDate: interview.createdAt
              }));
              chatHistory.push(...interviewChats);
            }
          });

          // Sort chat history by timestamp
          chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          // Format skills from interview result category scores or use candidate skills
          let formattedSkills = [];
          if (latestInterviewResult && latestInterviewResult.categoryScores) {
            // Convert categoryScores object to array of skills with proficiency
            formattedSkills = Object.entries(latestInterviewResult.categoryScores).map(([skill, score]) => ({
              name: skill,
              proficiency: score,
              level: getProficiencyLevel(score)
            }));
          } else if (candidate.skills && candidate.skills.length > 0) {
            // Use candidate's existing skills
            formattedSkills = candidate.skills.map(skill => 
              typeof skill === 'string' 
                ? { name: skill, proficiency: 0, level: 'Not assessed' }
                : { name: skill.name || 'Unknown', proficiency: skill.proficiency || 0, level: skill.level || 'Not assessed' }
            );
          } else {
            // Default skills if none exist
            formattedSkills = [
              { name: 'JavaScript', proficiency: 0, level: 'Not assessed' },
              { name: 'React', proficiency: 0, level: 'Not assessed' },
              { name: 'Node.js', proficiency: 0, level: 'Not assessed' }
            ];
          }

          // Calculate overall score from interview result or candidate score
          let overallScore = candidate.score;
          if (latestInterviewResult && latestInterviewResult.overallScore) {
            overallScore = latestInterviewResult.overallScore;
          }

          return {
            _id: candidate._id,
            name: candidate.name || 'Unknown Candidate',
            email: candidate.email,
            phone: candidate.phone || 'Not provided',
            avatar: candidate.avatar || candidate.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UC',
            experience: candidate.experience || 'Not specified',
            score: overallScore || 0,
            status: candidate.status || 'new',
            appliedDate: candidate.appliedDate,
            resume: candidate.resume || 'No resume uploaded',
            skills: formattedSkills,
            
            // Interview-related data
            interviewStatus: latestInterview?.status || 'not_started',
            currentQuestion: latestInterview?.currentQuestion || 1,
            totalQuestions: latestInterview?.totalQuestions || 6,
            interviewProgress: latestInterview ? 
              Math.round(((latestInterview.currentQuestion - 1) / latestInterview.totalQuestions) * 100) : 0,
            chatHistory: chatHistory,
            
            // Interview timing data
            interviewStartTime: latestInterview?.startTime || null,
            interviewEndTime: latestInterview?.endTime || null,
            timeRemaining: latestInterview?.timeRemaining || null,
            questionTimeRemaining: latestInterview?.questionTimeRemaining || null,
            
            // Interview results data - include ALL results
            interviewResults: interviewResults.length > 0 ? interviewResults.map(result => ({
              _id: result._id,
              interviewId: result.interviewId,
              candidateId: result.candidateId,
              positionId: result.positionId,
              overallScore: result.overallScore,
              categoryScores: result.categoryScores || {},
              strengths: result.strengths || [],
              weaknesses: result.weaknesses || [],
              recommendations: result.recommendations || [],
              detailedFeedback: result.detailedFeedback || '',
              aiAnalysis: result.aiAnalysis || {},
              recommendation: result.recommendation || '',
              nextSteps: result.nextSteps || [],
              createdAt: result.createdAt,
              generatedAt: result.generatedAt
            })) : null,
            
            latestInterviewResult: latestInterviewResult ? {
              _id: latestInterviewResult._id,
              overallScore: latestInterviewResult.overallScore,
              categoryScores: latestInterviewResult.categoryScores || {},
              strengths: latestInterviewResult.strengths || [],
              weaknesses: latestInterviewResult.weaknesses || [],
              recommendations: latestInterviewResult.recommendations || [],
              detailedFeedback: latestInterviewResult.detailedFeedback || '',
              aiAnalysis: latestInterviewResult.aiAnalysis || {},
              recommendation: latestInterviewResult.recommendation || '',
              nextSteps: latestInterviewResult.nextSteps || [],
              createdAt: latestInterviewResult.createdAt,
              generatedAt: latestInterviewResult.generatedAt
            } : null,
            
            // Additional candidate metadata
            linkStatus: candidate.linkStatus || 'notOpened',
            resumeProcessed: candidate.resumeProcessed || false,
            interviewCount: interviews.length,
            totalInterviewTime: candidate.totalInterviewTime || 0,
            lastInterviewDate: latestInterview?.createdAt,
            
            // Computed fields
            hasCompletedInterview: latestInterview?.status === 'completed',
            hasInterviewResults: interviewResults.length > 0,
            isInterviewInProgress: latestInterview?.status === 'in_progress',
            canStartInterview: !latestInterview || latestInterview.status === 'cancelled' || latestInterview.status === 'expired'
          };
          
        } catch (error) {
          console.error(`Error enriching candidate ${candidate._id}:`, error);
          
          // Return basic candidate data if enrichment fails
          return {
            _id: candidate._id,
            name: candidate.name || 'Unknown Candidate',
            email: candidate.email,
            phone: candidate.phone || 'Not provided',
            avatar: candidate.avatar || 'UC',
            experience: candidate.experience || 'Not specified',
            score: candidate.score || 0,
            status: candidate.status || 'new',
            appliedDate: candidate.appliedDate,
            resume: candidate.resume || 'No resume uploaded',
            skills: candidate.skills && candidate.skills.length > 0 
              ? candidate.skills.map(skill => 
                  typeof skill === 'string' 
                    ? { name: skill, proficiency: 0, level: 'Not assessed' }
                    : { name: skill.name || 'Unknown', proficiency: skill.proficiency || 0, level: skill.level || 'Not assessed' }
                )
              : [
                  { name: 'JavaScript', proficiency: 0, level: 'Not assessed' },
                  { name: 'React', proficiency: 0, level: 'Not assessed' },
                  { name: 'Node.js', proficiency: 0, level: 'Not assessed' }
                ],
            chatHistory: [],
            interviewResults: null,
            latestInterviewResult: null,
            interviewStatus: 'not_started',
            hasCompletedInterview: false,
            hasInterviewResults: false,
            isInterviewInProgress: false,
            canStartInterview: true
          };
        }
      })
    );

    // Sort candidates by application date (most recent first) and then by score
    enrichedCandidates.sort((a, b) => {
      // First, sort by interview completion status
      if (a.hasCompletedInterview && !b.hasCompletedInterview) return -1;
      if (!a.hasCompletedInterview && b.hasCompletedInterview) return 1;
      
      // Then by score (highest first)
      if (a.score !== b.score) return b.score - a.score;
      
      // Finally by application date (most recent first)
      return new Date(b.appliedDate) - new Date(a.appliedDate);
    });
    
    console.log(`Found ${enrichedCandidates.length} candidates for position ${jobId}`);
    
    res.json({
      success: true,
      data: enrichedCandidates,
      count: enrichedCandidates.length,
      summary: {
        totalCandidates: enrichedCandidates.length,
        completedInterviews: enrichedCandidates.filter(c => c.hasCompletedInterview).length,
        inProgressInterviews: enrichedCandidates.filter(c => c.isInterviewInProgress).length,
        pendingInterviews: enrichedCandidates.filter(c => c.canStartInterview).length,
        averageScore: enrichedCandidates.length > 0 
          ? Math.round(enrichedCandidates.reduce((sum, c) => sum + c.score, 0) / enrichedCandidates.length)
          : 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching position candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates for this position',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Helper function to convert proficiency score to level
function getProficiencyLevel(score) {
  if (score >= 90) return 'Expert';
  if (score >= 75) return 'Advanced';
  if (score >= 60) return 'Intermediate';
  if (score >= 40) return 'Beginner';
  return 'Novice';
}

// Add a new candidate to a position - ONLY if email is sent successfully
// Add a new candidate to a position - Save first, then send email with candidate ID
export const addCandidate = async (req, res) => {
  let savedCandidate = null;
  
  try {
    const { jobId } = req.params;
    console.log('Request body:', req.user);
    const recruiterId = req.user.id;
    console.log(jobId)
    console.log('Adding candidate to job:', jobId, 'by recruiter:', recruiterId);
    console.log('Environment check:', process.env.BASE_URL, process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
    
    // Verify the position belongs to the recruiter
    const position = await Position.findOne({ 
      _id: new mongoose.Types.ObjectId(jobId), 
      recruiter: new mongoose.Types.ObjectId(recruiterId)
    });
    
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    const { name, email, phone, experience, skills, resume } = req.body;

    // Check if candidate already exists for this position
    const existingCandidate = await Candidate.findOne({ 
      email, 
      positionId: jobId 
    });

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate already exists for this position'
      });
    }

    // Process skills array
    const processedSkills = Array.isArray(skills) 
      ? skills.map(skill => typeof skill === 'string' ? { name: skill.trim() } : skill)
      : skills.split(',').map(skill => ({ name: skill.trim() })).filter(skill => skill.name);

    // Generate unique interview token
    const interviewToken = crypto.randomBytes(32).toString('hex');

    // Prepare candidate data and SAVE FIRST
    const candidateData = {
      name,
      email,
      phone: phone || '',
      positionId: jobId,
      recruiterId,
      experience: experience || 'Not specified',
      skills: processedSkills,
      resume: resume || '',
      status: 'new',
      interviewToken: interviewToken
    };

    // STEP 1: Save the candidate first
    savedCandidate = new Candidate(candidateData);
    await savedCandidate.save();
    
    console.log(`✅ Candidate saved with ID: ${savedCandidate._id}`);

    // STEP 2: Create interview link with actual candidate ID
    const interviewLink = `${process.env.BASE_URL}/${savedCandidate._id}`;

    console.log('Candidate email:', email);

    // Email template with candidate ID link
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Invitation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f7;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1d1d1f;
          }
          .message {
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 30px;
            color: #424245;
          }
          .job-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .job-title {
            font-size: 18px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 5px;
          }
          .company {
            font-size: 16px;
            color: #007AFF;
            font-weight: 500;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            min-width: 200px;
          }
          .cta-button:hover {
            opacity: 0.9;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e5e7;
          }
          .footer p {
            margin: 0;
            color: #6e6e73;
            font-size: 14px;
          }
          .note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .note p {
            margin: 0;
            color: #856404;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Interview Invitation</h1>
          </div>
          
          <div class="content">
            <div class="greeting">
              Hi ${name},
            </div>
            
            <div class="message">
              Congratulations! We're excited to move forward with your application. You've been selected to participate in our AI-powered interview process.
            </div>
            
            <div class="job-details">
              <div class="job-title">${position.title}</div>
              <div class="company">at ${position.company}</div>
            </div>
            
            <div class="message">
              Our innovative AI interview system will assess your skills, experience, and fit for the role. The process is designed to be conversational and engaging, allowing you to showcase your abilities in a comfortable environment.
            </div>
            
            <div style="text-align: center;">
              <a href="${interviewLink}" class="cta-button">Start AI Interview</a>
            </div>
            
            <div class="note">
              <p><strong>Important:</strong> This interview link is unique to you and will expire in 7 days. Please complete the interview at your earliest convenience.</p>
            </div>
            
            <div class="message">
              <strong>What to expect:</strong><br>
              • Duration: 15-30 minutes<br>
              • Interactive AI conversation<br>
              • Questions tailored to the role<br>
              • Immediate feedback upon completion
            </div>
            
            <div class="message">
              If you have any questions or need technical support, please don't hesitate to reach out to our team.
            </div>
            
            <div class="message">
              Best of luck!<br>
              The Recruitment Team
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Tracking ID: ${savedCandidate._id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"AuraSync Recruitment" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎯 AI Interview Invitation - ${position.title} at ${position.company}`,
      html: emailTemplate
    };

    console.log('Mail options:', mailOptions);

    // STEP 3: Send email with candidate ID link
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Interview email sent successfully to ${email} with candidate ID: ${savedCandidate._id}`);
      
      // Populate position details for response
      await savedCandidate.populate('positionId', 'title company');

      res.status(201).json({
        success: true,
        message: 'Candidate added successfully and interview email sent',
        data: {
          ...savedCandidate.toObject(),
          interviewLink: interviewLink // Include in response for testing
        }
      });

    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      
      // STEP 4: Email failed, remove the saved candidate
      if (savedCandidate && savedCandidate._id) {
        try {
          await Candidate.findByIdAndDelete(savedCandidate._id);
          console.log(`🗑️ Candidate ${savedCandidate._id} removed due to email failure`);
        } catch (deleteError) {
          console.error('❌ Error removing candidate after email failure:', deleteError);
        }
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send interview email. Candidate not saved. Please check email configuration.',
        error: emailError.message
      });
    }

  } catch (error) {
    console.error('Error adding candidate:', error);
    
    // If there was an error during candidate creation and we have a saved candidate, clean it up
    if (savedCandidate && savedCandidate._id) {
      try {
        await Candidate.findByIdAndDelete(savedCandidate._id);
        console.log(`🗑️ Candidate ${savedCandidate._id} removed due to creation error`);
      } catch (deleteError) {
        console.error('❌ Error removing candidate after creation error:', deleteError);
      }
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add candidate'
    });
  }
};
// Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id; // Changed from req.recruiter.id to req.user.id

    const candidate = await Candidate.findOne({ 
      _id: id, 
      recruiterId 
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const updates = req.body;
    
    // Process skills if provided
    if (updates.skills) {
      if (Array.isArray(updates.skills)) {
        updates.skills = updates.skills.map(skill => 
          typeof skill === 'string' ? { name: skill.trim() } : skill
        );
      } else if (typeof updates.skills === 'string') {
        updates.skills = updates.skills.split(',').map(skill => ({ name: skill.trim() })).filter(skill => skill.name);
      }
    }

    Object.assign(candidate, updates);
    await candidate.save();

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate'
    });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id; // Changed from req.recruiter.id to req.user.id

    const candidate = await Candidate.findOneAndDelete({ 
      _id: id, 
      recruiterId 
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete candidate'
    });
  }
};