import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  chatHistory: [{
    sender: {
      type: String,
      enum: ['AI', 'candidate'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['question', 'answer', 'feedback', 'system'],
      default: 'question'
    }
  }],
  aiAssessment: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    technicalSkills: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    communication: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    culturalFit: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    problemSolving: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  skillAssessments: [{
    skillName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    questions: [{
      question: String,
      answer: String,
      aiFeedback: String,
      score: Number
    }]
  }],
  interviewStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
    default: 'not_started'
  },
  interviewStartTime: {
    type: Date
  },
  interviewEndTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  feedback: {
    aiFeedback: String,
    recruiterFeedback: String,
    strengths: [String],
    areasForImprovement: [String],
    recommendation: {
      type: String,
      enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'],
      default: 'maybe'
    }
  },
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    candidateResponseTime: {
      average: Number,
      total: Number
    },
    engagementScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
performanceSchema.index({ candidateId: 1 });
performanceSchema.index({ positionId: 1, 'aiAssessment.overallScore': -1 });
performanceSchema.index({ recruiterId: 1, createdAt: -1 });

export const CandidatePerformance = mongoose.model('CandidatePerformance', performanceSchema);