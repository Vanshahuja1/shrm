const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  
  organisation: {
    type: String,
    required: [true, 'Organisation name is required'],
    trim: true,
    maxlength: [100, 'Organisation name cannot exceed 100 characters']
  },
  
  totalEmployeesCount: {
    type: Number,
    required: [true, 'Total employees count is required'],
    min: [0, 'Total employees count cannot be negative'],
    default: 0
  },
  
  totalManagerCount: {
    type: Number,
    required: [true, 'Total manager count is required'],
    min: [0, 'Total manager count cannot be negative'],
    default: 0
  },
  
  totalInternsCount: {
    type: Number,
    required: [true, 'Total interns count is required'],
    min: [0, 'Total interns count cannot be negative'],
    default: 0
  },
  
  totalCount: {
    type: Number,
    required: [true, 'Total count is required'],
    min: [0, 'Total count cannot be negative'],
    default: 0
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  versionKey: false // Removes __v field
});

// Index for better query performance
departmentSchema.index({ name: 1, organisation: 1 });

// Pre-save middleware to automatically calculate totalCount
departmentSchema.pre('save', function(next) {
  this.totalCount = this.totalEmployeesCount + this.totalManagerCount + this.totalInternsCount;
  next();
});

// Pre-update middleware for findOneAndUpdate operations
departmentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.totalEmployeesCount !== undefined || 
      update.totalManagerCount !== undefined || 
      update.totalInternsCount !== undefined) {
    
    const employeesCount = update.totalEmployeesCount || 0;
    const managerCount = update.totalManagerCount || 0;
    const internsCount = update.totalInternsCount || 0;
    
    update.totalCount = employeesCount + managerCount + internsCount;
  }
  next();
});

// Instance method to get department summary
departmentSchema.methods.getSummary = function() {
  return {
    departmentName: this.name,
    organisation: this.organisation,
    breakdown: {
      employees: this.totalEmployeesCount,
      managers: this.totalManagerCount,
      interns: this.totalInternsCount,
      total: this.totalCount
    }
  };
};

// Static method to find departments by organisation
departmentSchema.statics.findByOrganisation = function(orgName) {
  return this.find({ organisation: orgName });
};

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;