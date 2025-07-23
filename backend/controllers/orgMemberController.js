const User = require("../models/userModel");

// Get all members with OrgMemberInfo format
exports.getMembers = async (req, res) => {
  try {
    // Get orgName from params (with mergeParams) or from custom middleware
    const orgName = req.params.orgName || req.orgName;
    console.log("Searching for members with organizationName:", orgName);
    const members = await User.find({ organizationName: orgName });
    console.log("Found members count:", members.length);

    const formattedMembers = members.map((member) => member.OrgMemberInfo);
    res.status(200).json(formattedMembers);
  } catch (error) {
    console.error("Error in getMembers:", error);
    res.status(500).json({ message: "Error fetching members" });
  }
};

// Get all members in raw format (if needed)
exports.getMembersRaw = async (req, res) => {
  try {
    const orgName = req.params.orgName || req.orgName;
    const members = await User.find({ organizationName: orgName });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members" });
  }
};


exports.getEmpInfo = async (req, res) => {
  try {
    const orgName = req.params.orgName || req.orgName;
    const members = await User.find({ organizationName: orgName });
    const empInfo = members.map((member) => member.employeeInfo);

    res.status(200).json(empInfo);
  } catch (error) {
    console.error("Error in getEmpInfo:", error);
    res.status(500).json({ message: "Error fetching employee information" });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    // console.log("Fetching member with ID:", req.params.id);
    const member = await User.findOne({ id: req.params.id });
    // console.log("Member found:", member ? member.name : "Not found");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member.OrgMemberInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member" });
  }
};

// Get member by ID in raw format (if needed for editing)
exports.getMemberByIdRaw = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member" });
  }
};

exports.createMember = async (req, res) => {
  try {
    // Transform the input data to match the User model schema
    const memberData = {
      name: req.body.name,
      role: req.body.role,
      departmentName: req.body.department,
      organizationName: req.orgName || req.params.orgName,
      salary: req.body.salary,
      projects: req.body.projects,
      upperManager: req.body.upperManager,
      experience: req.body.experience,
      email: req.body.contactInfo?.email,
      phone: req.body.contactInfo?.phone,
      address: req.body.contactInfo?.address,
      panCard: req.body.documents?.pan,
      adharCard: req.body.documents?.aadhar,
      joiningDate: req.body.joiningDate,
      taskCountPerDay: req.body.performanceMetrics?.tasksPerDay,
      attendanceCount30Days: req.body.performanceMetrics?.attendanceScore,
      performance: req.body.performanceMetrics?.combinedPercentage,
      isActive: req.body.attendance?.todayPresent,
      // Auto-generate ID based on role
      id: await User.getNextId(req.body.role),
    };

    const newMember = new User(memberData);
    await newMember.save();
    res.status(201).json(newMember.OrgMemberInfo);
  } catch (error) {
    console.error("Error creating member:", error);
    res
      .status(500)
      .json({ message: "Error creating member", error: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    console.log("Updating member with ID:", req.params.id);
    console.log("Updating member with ID:", req.body);

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.role) updateData.role = req.body.role;
    if (req.body.department) updateData.departmentName = req.body.department;
    if (req.body.salary) updateData.salary = req.body.salary;
    if (req.body.projects) updateData.projects = req.body.projects;
    if (req.body.experience) updateData.experience = req.body.experience;
    if (req.body.contactInfo?.email)
      updateData.email = req.body.contactInfo.email;
    if( req.body.upperManager)
      updateData.upperManager = req.body.upperManager;
    if (req.body.contactInfo?.phone)
      updateData.phone = req.body.contactInfo.phone;
    if (req.body.contactInfo?.address)
      updateData.address = req.body.contactInfo.address;
    if (req.body.documents?.pan) updateData.panCard = req.body.documents.pan;
    if (req.body.documents?.aadhar)
      updateData.adharCard = req.body.documents.aadhar;
    if (req.body.joiningDate) updateData.joiningDate = req.body.joiningDate;
    if (req.body.performanceMetrics?.tasksPerDay)
      updateData.taskCountPerDay = req.body.performanceMetrics.tasksPerDay;
    if (req.body.performanceMetrics?.attendanceScore)
      updateData.attendanceCount30Days =
        req.body.performanceMetrics.attendanceScore;
    if (req.body.performanceMetrics?.combinedPercentage)
      updateData.performance = req.body.performanceMetrics.combinedPercentage;
    if (req.body.attendance?.todayPresent !== undefined)
      updateData.isActive = req.body.attendance.todayPresent;

    const updatedMember = await User.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(updatedMember.OrgMemberInfo);
  } catch (error) {
    console.error("Error updating member:", error);
    res
      .status(500)
      .json({ message: "Error updating member", error: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const deletedMember = await User.findOneAndDelete({ id: req.params.id });
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member" });
  }
};

// Get members by department with OrgMemberInfo format
exports.getMembersByDepartment = async (req, res) => {
  try {
    const orgName = req.params.orgName || req.orgName;
    const members = await User.find({
      organizationName: orgName,
      departmentName: req.params.department,
    });
    const formattedMembers = members.map((member) => member.OrgMemberInfo);
    res.status(200).json(formattedMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching department members" });
  }
};

// Get members by role with OrgMemberInfo format
exports.getMembersByRole = async (req, res) => {
  try {
    const orgName = req.params.orgName || req.orgName;
    const members = await User.find({
      organizationName: orgName,
      role: req.params.role,
    });
    const formattedMembers = members.map((member) => member.OrgMemberInfo);
    res.status(200).json(formattedMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching role members" });
  }
};
