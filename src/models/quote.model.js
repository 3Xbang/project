/**
 * 报价数据模型
 * 
 * 定义工程报价的数据结构，包括:
 * - 标题和描述
 * - 客户ID
 * - 金额
 * - 确认状态
 */

const mongoose = require('mongoose');

// 定义报价模式
const quoteSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联客户账户']
  },
  title: {
    type: String,
    required: [true, '必须提供报价标题'],
    trim: true,
    maxlength: [100, '标题不能超过100个字符']
  },
  description: {
    type: String,
    maxlength: [1000, '描述不能超过1000个字符']
  },
  amount: {
    type: Number,
    required: [true, '必须提供报价金额']
  },
  validUntil: {
    type: Date,
    required: [true, '必须提供有效期']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'expired'],
    default: 'pending'
  },
  statusText: {
    type: String,
    default: '待确认'
  },
  confirmedAt: {
    type: Date
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  items: [{
    name: String,
    description: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  notes: {
    type: String,
    maxlength: [500, '备注不能超过500个字符']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联创建者账户']
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
quoteSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 更新状态时自动设置statusText
quoteSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'pending':
        this.statusText = '待确认';
        break;
      case 'confirmed':
        this.statusText = '已确认';
        this.confirmedAt = new Date();
        break;
      case 'rejected':
        this.statusText = '已拒绝';
        break;
      case 'expired':
        this.statusText = '已过期';
        break;
      default:
        this.statusText = '未知状态';
    }
  }
  next();
});

// 计算总金额的中间件
quoteSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    let totalAmount = 0;
    this.items.forEach(item => {
      item.totalPrice = item.quantity * item.unitPrice;
      totalAmount += item.totalPrice;
    });
    this.amount = totalAmount;
  }
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;