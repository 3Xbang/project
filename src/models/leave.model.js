/**
 * 请假申请数据模型
 * 
 * 定义员工请假申请的数据结构，包括:
 * - 员工ID
 * - 请假类型
 * - 开始和结束时间
 * - 请假原因
 * - 审批状态
 */

const mongoose = require('mongoose');

// 定义请假申请模式
const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联员工账户']
  },
  type: {
    type: String,
    enum: ['sick', 'personal', 'annual', 'marriage', 'maternity', 'funeral'],
    required: [true, '必须提供请假类型']
  },
  startDateTime: {
    type: Date,
    required: [true, '必须提供开始时间']
  },
  endDateTime: {
    type: Date,
    required: [true, '必须提供结束时间']
  },
  hours: {
    type: Number,
    required: [true, '必须提供请假小时数']
  },
  reason: {
    type: String,
    required: [true, '必须提供请假原因'],
    maxlength: [500, '原因不能超过500个字符']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  statusClass: {
    type: String,
    enum: ['status-pending', 'status-approved', 'status-rejected'],
    default: 'status-pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionDate: {
    type: Date
  },
  rejectReason: {
    type: String,
    maxlength: [500, '拒绝原因不能超过500个字符']
  },
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
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
leaveSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 当状态更改时，设置相应的状态样式类和操作日期
leaveSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'pending':
        this.statusClass = 'status-pending';
        break;
      case 'approved':
        this.statusClass = 'status-approved';
        this.actionDate = new Date();
        break;
      case 'rejected':
        this.statusClass = 'status-rejected';
        this.actionDate = new Date();
        break;
      case 'cancelled':
        this.statusClass = 'status-rejected';
        break;
    }
  }
  
  // 自动计算请假小时数
  if ((this.isModified('startDateTime') || this.isModified('endDateTime')) && this.startDateTime && this.endDateTime) {
    const diffMs = this.endDateTime - this.startDateTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    this.hours = Math.round(diffHours * 10) / 10; // 保留一位小数
  }
  
  next();
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;