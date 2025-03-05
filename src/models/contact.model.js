/**
 * 联系表单数据模型
 * 
 * 定义网站联系表单的数据结构，包括:
 * - 发送者姓名
 * - 联系邮箱
 * - 联系电话
 * - 消息内容
 * - 项目类型
 * - 处理状态
 */

const mongoose = require('mongoose');

// 定义联系表单模式
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '必须提供姓名'],
    trim: true,
    maxlength: [100, '姓名不能超过100个字符']
  },
  email: {
    type: String,
    required: [true, '必须提供电子邮箱'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '请提供有效的电子邮箱'
    ]
  },
  phone: {
    type: String,
    required: [true, '必须提供电话号码'],
    maxlength: [20, '电话号码不能超过20个字符']
  },
  message: {
    type: String,
    required: [true, '必须提供消息内容'],
    maxlength: [2000, '消息内容不能超过2000个字符']
  },
  projectType: {
    type: String,
    enum: ['Commercial', 'Residential', 'Industrial', 'Infrastructure', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['new', 'in-review', 'contacted', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
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
contactSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 添加处理笔记
contactSchema.methods.addNote = function(content, userId) {
  this.notes.push({
    content,
    createdBy: userId,
    createdAt: new Date()
  });
  
  return this;
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 