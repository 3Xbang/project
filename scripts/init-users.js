/**
 * 用户初始化脚本
 * 该脚本用于创建测试用户账号，包括管理员、客户和员工角色
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 连接MongoDB数据库
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => {
  console.error('MongoDB连接错误:', err);
  process.exit(1);
});

// 定义用户模式
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee', 'client'],
    default: 'client'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建用户模型
const User = mongoose.model('User', userSchema);

/**
 * 创建测试用户
 * 包括管理员、客户和员工角色
 */
async function createTestUsers() {
  try {
    // 清除现有用户
    await User.deleteMany({});
    console.log('已清除现有用户');

    // 创建测试用户数组
    const users = [
      {
        firstName: '管理员',
        lastName: '用户',
        email: 'admin@repair-system.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      },
      {
        firstName: '测试',
        lastName: '客户',
        email: 'client@repair-system.com',
        password: await bcrypt.hash('client123', 10),
        role: 'client'
      },
      {
        firstName: '测试',
        lastName: '员工',
        email: 'employee@repair-system.com',
        password: await bcrypt.hash('employee123', 10),
        role: 'employee'
      }
    ];

    // 插入测试用户
    const result = await User.insertMany(users);
    console.log(`成功创建 ${result.length} 个测试用户`);
    
    // 显示用户信息，方便测试
    console.log('\n测试账号信息：');
    console.log('-------------------------------------');
    console.log('管理员账号: admin@repair-system.com');
    console.log('密码: admin123');
    console.log('-------------------------------------');
    console.log('客户账号: client@repair-system.com');
    console.log('密码: client123');
    console.log('-------------------------------------');
    console.log('员工账号: employee@repair-system.com');
    console.log('密码: employee123');
    console.log('-------------------------------------');
    
  } catch (error) {
    console.error('创建测试用户时出错:', error);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
    console.log('数据库连接已关闭');
  }
}

// 执行创建测试用户函数
createTestUsers(); 