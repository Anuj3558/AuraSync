import mongoose from 'mongoose';

const conversationMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  response: {
    type: String,
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  context: String,
  askedAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date,
    default: null
  }
});

const interviewSchema = new mongoose.Schema({
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
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'cancelled', 'expired'],
    default: 'started'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: null
  },
  currentQuestion: {
    type: Number,
    default: 1
  },
  totalQuestions: {
    type: Number,
    default: 6
  },
  questions: [questionSchema],
  conversationHistory: [conversationMessageSchema],
  completed: {
    type: Boolean,
    default: false
  },
  // NEW FIELDS FOR SESSION PERSISTENCE
  timeRemaining: {
    type: Number, // seconds remaining in total interview
    default: 1200 // 20 minutes = 1200 seconds
  },
  questionTimeRemaining: {
    type: Number, // seconds remaining for current question
    default: 180 // 3 minutes = 180 seconds
  },
  lastSavedAt: {
    type: Date,
    default: Date.now
  },
  autoSaveCount: {
    type: Number,
    default: 0
  },
  sessionPaused: {
    type: Boolean,
    default: false
  },
  pausedAt: {
    type: Date,
    default: null
  },
  resumedAt: {
    type: Date,
    default: null
  },
  totalPauseDuration: {
    type: Number, // total time paused in seconds
    default: 0
  },
  securityViolations: [{
    type: String,
    violation: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  browserInfo: {
    userAgent: String,
    language: String,
    platform: String,
    cookiesEnabled: Boolean
  },
  networkDisconnections: [{
    disconnectedAt: Date,
    reconnectedAt: Date,
    duration: Number // seconds
  }]
}, {
  timestamps: true
});

// Index for faster queries
interviewSchema.index({ candidateId: 1, status: 1 });
interviewSchema.index({ startTime: -1 });
interviewSchema.index({ status: 1, lastSavedAt: -1 });

// Middleware to update lastSavedAt on save
interviewSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastSavedAt = new Date();
  }
  next();
});

// Method to calculate actual interview time (excluding pauses)
interviewSchema.methods.getActualDuration = function() {
  if (!this.endTime) return null;
  
  const totalTime = (this.endTime - this.startTime) / 1000; // in seconds
  const actualTime = totalTime - (this.totalPauseDuration || 0);
  return Math.round(actualTime / 60); // return in minutes
};

// Method to check if interview is expired (inactive for too long)
interviewSchema.methods.isExpired = function() {
  if (this.status === 'completed') return false;
  
  const maxInactiveTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const now = new Date();
  const lastActivity = this.lastSavedAt || this.startTime;
  
  return (now - lastActivity) > maxInactiveTime;
};

export const Interview = mongoose.model('Interview', interviewSchema);