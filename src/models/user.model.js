/**
 * 用户数据模型
 * 
 * 定义用户数据结构，包括:
 * - 基本用户信息(姓名、邮箱等)
 * - 密码哈希与验证
 * - 用户角色(管理员/员工/客户)
 * - JWT令牌生成
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 定义用户模式
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, '必须提供用户名'],
    trim: true,
    maxlength: [50, '用户名不能超过50个字符']
  },
  lastName: {
    type: String,
    required: [true, '必须提供用户姓'],
    trim: true,
    maxlength: [50, '用户姓不能超过50个字符']
  },
  email: {
    type: String,
    required: [true, '必须提供电子邮箱'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '请提供有效的电子邮箱'
    ]
  },
  password: {
    type: String,
    required: [true, '必须设置密码'],
    minlength: [6, '密码长度不能少于6个字符'],
    select: false // 默认不在查询结果中返回密码
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee', 'client'],
    default: 'client'
  },
  // 员工特有字段
  permissionLevel: {
    type: String,
    required: function() {
      return this.role === 'admin' || this.role === 'manager' || this.role === 'employee';
    }
  },
  // 客户特有字段
  company: {
    type: String,
    required: function() {
      return this.role === 'client';
    }
  },
  phone: {
    type: String,
    maxlength: [20, '电话号码不能超过20个字符']
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

// 在保存前对密码进行加密
userSchema.pre('save', async function(next) {
  // 仅在密码被修改时才重新加密
  if (!this.isModified('password')) {
    next();
  }
  
  try {
    // 生成盐值
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    // 加密密码
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 在更新时自动设置updatedAt字段
userSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

/**
 * 检查密码是否匹配
 * @param {string} enteredPassword - 输入的明文密码
 * @returns {Promise<boolean>} 密码是否匹配
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * 生成JWT令牌
 * @returns {string} JWT令牌
 */
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * 获取公开用户信息(不包含敏感字段)
 * @returns {Object} 用户公开信息
 */
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  
  // 删除敏感字段
  delete userObject.password;
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 