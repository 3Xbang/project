/**
 * 临时施工模型
 * 
 * 用于记录客户的临时施工申请，包括施工类型、地点、时间等信息
 */

const mongoose = require('mongoose');

const TempWorkSchema = new mongoose.Schema({
  // 关联的客户
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须指定客户']
  },
  
  // 施工类型
  workType: {
    type: String,
    required: [true, '必须指定施工类型'],
    enum: ['水电维修', '墙面修补', '地板维修', '屋顶维修', '其他']
  },
  
  // 施工地点
  location: {
    type: String,
    required: [true, '必须指定施工地点']
  },
  
  // 预计开始时间
  startDate: {
    type: Date,
    required: [true, '必须指定预计开始时间']
  },
  
  // 预计结束时间
  endDate: {
    type: Date,
    required: [true, '必须指定预计结束时间']
  },
  
  // 施工描述
  description: {
    type: String,
    required: [true, '必须提供施工描述']
  },
  
  // 施工状态
  status: {
    type: String,
    enum: ['待审核', '已批准', '已拒绝', '进行中', '已完成'],
    default: '待审核'
  },
  
  // 审批人
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // 审批意见
  approvalComments: {
    type: String
  },
  
  // 施工人员
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 创建索引以提高查询性能
TempWorkSchema.index({ client: 1, status: 1 });
TempWorkSchema.index({ startDate: 1, endDate: 1 });

// 确保结束日期晚于开始日期
TempWorkSchema.pre('validate', function(next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate('endDate', '结束日期必须晚于开始日期');
  }
  next();
});

// 更新时自动更新updatedAt字段
TempWorkSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('TempWork', TempWorkSchema);