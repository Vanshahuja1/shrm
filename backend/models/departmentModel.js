const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  
  head: {
    type: String,
    required: [true, 'Department head is required'],
    trim: true,
    maxlength: [100, 'Department head name cannot exceed 100 characters']
  },
  
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative'],
    default: 0
  },
  
  managers: {
    type: Number,
    required: [true, 'Managers count is required'],
    min: [0, 'Managers count cannot be negative'],
    default: 0
  },
  
  employees: {
    type: Number,
    required: [true, 'Employees count is required'],
    min: [0, 'Employees count cannot be negative'],
    default: 0
  },
  
  interns: {
    type: Number,
    required: [true, 'Interns count is required'],
    min: [0, 'Interns count cannot be negative'],
    default: 0
  },
  //add a member ke andar list of available members aa jaaye
  members: {
    type: Array,
    default: []
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  versionKey: false // Removes __v field
});

// Index for better query performance
// departmentSchema.index({ name: 1, organisation: 1 });

// Pre-save middleware to automatically calculate totalCount
// departmentSchema.pre('save', function(next) {
//   this.totalCount = this.totalEmployeesCount + this.totalManagerCount + this.totalInternsCount;
//   next();
// });

// Pre-update middleware for findOneAndUpdate operations
departmentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.employees !== undefined || 
      update.managers !== undefined || 
      update.interns !== undefined) {
    
    const employeesCount = update.employees || 0;
    const managerCount = update.managers || 0;
    const internsCount = update.interns || 0;
    
    // Additional validation or calculations can be added here
  }
  next();
});

// Instance method to get department summary
departmentSchema.methods.getSummary = function() {
  return {
    departmentName: this.name,
    head: this.head,
    budget: this.budget,
    breakdown: {
      employees: this.employees,
      managers: this.managers,
      interns: this.interns,
      total: this.employees + this.managers + this.interns
    }
  };
};

// Static method to find departments by organisation
// departmentSchema.statics.findByOrganisation = function(orgName) {
//   return this.find({ organisation: orgName });
// };

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;