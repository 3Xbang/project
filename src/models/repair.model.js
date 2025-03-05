/**
 * 维修申请数据模型
 * 
 * 定义维修申请的数据结构，包括:
 * - 标题和描述
 * - 客户ID
 * - 申请日期
 * - 处理状态
 * - 优先级
 */

const mongoose = require('mongoose');

// 定义维修申请模式
const repairSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联客户账户']
  },
  title: {
    type: String,
    required: [true, '必须提供维修标题'],
    trim: true,
    maxlength: [100, '标题不能超过100个字符']
  },
  description: {
    type: String,
    required: [true, '必须提供维修描述'],
    maxlength: [1000, '描述不能超过1000个字符']
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: [true, '必须提供维修位置'],
    maxlength: [200, '位置不能超过200个字符']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  images: [{
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: Date
  },
  notes: {
    type: String,
    maxlength: [500, '备注不能超过500个字符']
  },
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
repairSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 当状态更改为完成时，设置完成日期
repairSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
  }
  next();
});

// 获取指定状态的维修请求数量
repairSchema.statics.countByStatus = async function(clientId, status) {
  return await this.countDocuments({ clientId, status });
};

// 获取维修请求统计数据
repairSchema.statics.getStats = async function(clientId) {
  const pending = await this.countDocuments({ clientId, status: 'pending' });
  const inProgress = await this.countDocuments({ clientId, status: 'in_progress' });
  const completed = await this.countDocuments({ clientId, status: 'completed' });
  
  return { pending, inProgress, completed };
};

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair; 