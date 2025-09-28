// models/Candidate.js
import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Unknown Candidate'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  linkStatus: {
  type: String,
  enum: ['notOpened', 'linkOpened', 'resumeProcess', 'completed'],
  default: 'notOpened'
},
 currentInterviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    default: null
  },
  lastInterviewDate: {
    type: Date,
    default: null
  },
  totalInterviewTime: {
    type: Number, // total time spent in interviews (minutes)
    default: 0
  },
  interviewCount: {
    type: Number,
    default: 0
  },
  linkStatus: {
    type: String,
    enum: ['notOpened', 'linkOpened', 'resumeProcess', 'active', 'completed', 'expired', 'suspended'],
    default: 'notOpened'
  },
  sessionPreferences: {
    autoSaveInterval: {
      type: Number,
      default: 5000 // 5 seconds
    },
    timeZone: String,
    preferredLanguage: {
      type: String,
      default: 'en'
    }
  },
  phone: {
    type: String,
    default: ''
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    default: null
  },
  recruiterId: {
    type: String,
    default: null
  },
  experience: {
    type: String,
    default: 'Not specified'
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    }
  }],
  resume: {
    type: String, // Stores the extracted text content
    default: ''
  },
  resumeFileName: {
    type: String,
    default: ''
  },
  resumeFileType: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'screening', 'interview', 'selected', 'rejected', 'on-hold'],
    default: 'new'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  avatar: {
    type: String,
    default: function() {
      if (this.name && this.name !== 'Unknown Candidate') {
        return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
      }
      return 'CU';
    }
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Additional fields for AI processing
  education: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  workExperience: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  // Metadata fields
  resumeProcessed: {
    type: Boolean,
    default: false
  },
  aiProcessingDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'candidates'
});

// Update avatar when name changes
candidateSchema.pre('save', function(next) {
  if (this.isModified('name') && this.name && this.name !== 'Unknown Candidate') {
    this.avatar = this.name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  if (this.isModified('resume') && this.resume) {
    this.resumeProcessed = true;
    this.aiProcessingDate = new Date();
  }
  
  this.lastUpdated = new Date();
  next();
});

// Index for better query performance
candidateSchema.index({ email: 1 });
candidateSchema.index({ positionId: 1 });
candidateSchema.index({ recruiterId: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ resumeProcessed: 1 });

export const Candidate = mongoose.model('Candidate', candidateSchema);