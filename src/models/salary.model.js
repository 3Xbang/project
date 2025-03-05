/**
 * 薪资数据模型
 * 
 * 定义员工薪资的数据结构，包括:
 * - 员工ID
 * - 基本工资
 * - 加班费
 * - 奖金
 * - 考勤奖励
 * - 扣除项目
 * - 税费
 * - 保险
 * - 实际薪资
 */

const mongoose = require('mongoose');

// 定义薪资模式
const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联员工账户']
  },
  month: {
    type: String,
    required: [true, '必须提供薪资月份'],
    match: [/^\d{6}$/, '月份格式必须为YYYYMM'] // 如202310
  },
  baseSalary: {
    type: Number,
    required: [true, '必须提供基本薪资']
  },
  overtime: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    default: 0
  },
  attendance: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  insurance: {
    type: Number,
    default: 0
  },
  actualSalary: {
    type: Number,
    required: [true, '必须提供实际薪资']
  },
  estimatedSalary: {
    type: Number,
    default: 0
  },
  salaryTrend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },
  trendReason: {
    type: String
  },
  paymentDate: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processed', 'completed'],
    default: 'pending'
  },
  dailyRecords: [{
    date: Date,
    workHours: Number,
    overtime: Number,
    overtimePay: Number
  }],
  deductionDetails: [{
    reason: String,
    amount: Number
  }],
  bonusDetails: [{
    reason: String,
    amount: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 在更新时自动设置updatedAt字段
salarySchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 自动计算实际薪资
salarySchema.pre('save', function(next) {
  if (this.isModified('baseSalary') || 
      this.isModified('overtime') || 
      this.isModified('bonus') || 
      this.isModified('attendance') || 
      this.isModified('deductions') || 
      this.isModified('tax') || 
      this.isModified('insurance')) {
    
    // 计算总收入
    const totalIncome = this.baseSalary + this.overtime + this.bonus + this.attendance;
    
    // 计算总扣除
    const totalDeductions = this.deductions + this.tax + this.insurance;
    
    // 计算实际薪资
    this.actualSalary = totalIncome - totalDeductions;
  }
  
  next();
});

// 获取员工历史薪资数据
salarySchema.statics.getHistory = async function(employeeId, limit = 6) {
  return await this.find({ employeeId })
    .sort({ month: -1 })
    .limit(limit)
    .select('month actualSalary baseSalary overtime bonus');
};

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary; 