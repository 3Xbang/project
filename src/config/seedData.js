/**
 * 数据库初始化脚本
 * 
 * 用于预置测试账户和基础数据
 */

const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

/**
 * 创建测试账户
 */
const seedUsers = async () => {
  try {
    // 检查是否已有用户数据
    const count = await User.countDocuments();
    
    if (count > 0) {
      console.log('数据库中已有用户数据，跳过初始化');
      return;
    }
    
    console.log('开始创建测试账户...');
    
    // 生成密码哈希
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    
    // 创建管理员账户
    const adminUser = new User({
      firstName: '管理员',
      lastName: '',
      email: 'admin@3xbang.com',
      password: await bcrypt.hash('admin123', salt),
      role: 'admin',
      permissionLevel: 'admin'
    });
    
    // 创建员工账户
    const staffUser = new User({
      firstName: '员工',
      lastName: '小王',
      email: 'staff@3xbang.com',
      password: await bcrypt.hash('staff123', salt),
      role: 'employee',
      permissionLevel: 'V1'
    });
    
    // 创建客户账户
    const clientUser = new User({
      firstName: '客户',
      lastName: '公司A',
      email: 'client@example.com',
      password: await bcrypt.hash('client123', salt),
      role: 'client',
      company: '示范建筑公司'
    });
    
    // 保存用户
    await adminUser.save();
    await staffUser.save();
    await clientUser.save();
    
    console.log('测试账户创建成功');
  } catch (error) {
    console.error('创建测试账户失败:', error);
  }
};

/**
 * 初始化数据库
 */
const initializeDatabase = async () => {
  try {
    // 创建测试账户
    await seedUsers();
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
};

module.exports = { initializeDatabase }; 