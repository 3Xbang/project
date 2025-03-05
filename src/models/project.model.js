/**
 * 项目数据模型
 * 
 * 定义建筑项目的数据结构，包括:
 * - 项目基本信息(标题、描述、位置等)
 * - 客户信息
 * - 开始和结束日期
 * - 项目状态和进度
 * - 预算和实际成本
 * - 项目特性和相关任务
 */

const mongoose = require('mongoose');

// 定义项目模式
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '必须提供项目标题'],
    trim: true,
    maxlength: [100, '项目标题不能超过100个字符']
  },
  description: {
    type: String,
    required: [true, '必须提供项目描述'],
    maxlength: [2000, '项目描述不能超过2000个字符']
  },
  location: {
    type: String,
    required: [true, '必须提供项目位置'],
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联客户']
  },
  startDate: {
    type: Date,
    required: [true, '必须提供开始日期']
  },
  endDate: {
    type: Date,
    required: [true, '必须提供计划结束日期']
  },
  actualEndDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'on-hold', 'cancelled'],
    default: 'planned'
  },
  progress: {
    type: Number,
    min: [0, '进度不能低于0%'],
    max: [100, '进度不能超过100%'],
    default: 0
  },
  budget: {
    type: Number,
    required: [true, '必须提供项目预算']
  },
  actualCost: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: '/default-project.jpg'
  },
  features: {
    type: [String],
    default: []
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  gallery: [{
    url: String,
    thumbnail: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    name: String,
    description: String,
    fileUrl: String,
    fileType: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
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
projectSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 根据客户ID查找项目的静态方法
projectSchema.statics.findByClientId = function(clientId) {
  return this.find({ client: clientId });
};

// 获取项目摘要(用于列表展示)
projectSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    location: this.location,
    startDate: this.startDate,
    endDate: this.endDate,
    status: this.status,
    progress: this.progress,
    imageUrl: this.imageUrl
  };
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 