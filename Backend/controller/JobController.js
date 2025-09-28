import Position from '../models/Job.js'
import mongoose from 'mongoose';

// @desc    Create a new position
// @route   POST /api/positions
// @access  Private
export const createPosition = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salaryRange,
      experienceLevel,
      skills,
      description,
      requirements
    } = req.body;

    // Get recruiter ID from authenticated user
    const recruiter = req.user._id;
    console.log(recruiter)
    const position = new Position({
      title,
      company,
      recruiter,
      location,
      salaryRange,
      experienceLevel,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      description,
      requirements
    });

    const createdPosition = await position.save();
    
    // Populate recruiter details
    await createdPosition.populate('recruiter', 'name email');

    res.status(201).json({
      success: true,
      data: createdPosition
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all positions for a recruiter
// @route   GET /api/positions
// @access  Private
export const getPositions = async (req, res) => {
  try {
    const recruiter = req.user._id;
    const { search, page = 1, limit = 10 } = req.query;
    console.log(recruiter)
    let query = { recruiter  };
    console.log(query)
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const positions = await Position.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Position.countDocuments(query);

    res.json({
      success: true,
      data: positions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single position
// @route   GET /api/positions/:id
// @access  Private
export const getPosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('recruiter', 'name email');

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    // Check if position belongs to the recruiter
    if (position.recruiter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this position'
      });
    }

    res.json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update position
// @route   PUT /api/positions/:id
// @access  Private
export const updatePosition = async (req, res) => {
  try {
    let position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    // Check if position belongs to the recruiter
    if (position.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this position'
      });
    }

    position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('recruiter', 'name email');

    res.json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete position
// @route   DELETE /api/positions/:id
// @access  Private
export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    // Check if position belongs to the recruiter
    if (position.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this position'
      });
    }

    await Position.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Position deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};