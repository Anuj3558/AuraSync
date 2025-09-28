import mongoose from 'mongoose';
const resultSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    unique: true
  },
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
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  categoryScores: {
    technical: {
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
    problemSolving: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    experience: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  detailedFeedback: {
    type: String,
    required: true
  },
  aiAnalysis: {
    responseQuality: String,
    technicalAccuracy: String,
    communicationStyle: String,
    overallAssessment: String
  },
  recommendation: {
    type: String,
    
    required: true
  },
  nextSteps: [String],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
resultSchema.index({ candidateId: 1 });
resultSchema.index({ interviewId: 1 });
resultSchema.index({ overallScore: -1 });

export const InterviewResult = mongoose.model('InterviewResult', resultSchema);