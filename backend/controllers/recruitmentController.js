const Candidate = require("../models/candidateModel");

// Create a new candidate
const createCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const query = { ...req.query };

    if (query.name) {
      query.name = { $regex: new RegExp(query.name, "i") };
    }
    if (query.jobTitle) {
      query.jobTitle = { $regex: new RegExp(query.jobTitle, "i") };
    }

    if (query.appliedDate) {
      if (typeof query.appliedDate === "object") {
        const dateQuery = {};
        if (query.appliedDate.gte)
          dateQuery.$gte = new Date(query.appliedDate.gte);
        if (query.appliedDate.lte)
          dateQuery.$lte = new Date(query.appliedDate.lte);
        query.appliedDate = dateQuery;
      } else {
        query.appliedDate = new Date(query.appliedDate);
      }
    }

    const candidates = await Candidate.find(query);
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get candidate by ID
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update candidate
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule interview
const scheduleInterview = async (req, res) => {
  try {
    const { scheduledDate, interviewer } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.interviewScheduled = {
      isScheduled: true,
      scheduledDate,
      interviewer,
    };

    await candidate.save();
    res.json({ message: "Interview scheduled successfully", candidate });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  scheduleInterview,
};
