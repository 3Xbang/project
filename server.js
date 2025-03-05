/**
 * 3XBANG建筑公司后端API系统 - 服务器入口文件
 * 
 * 此文件是后端应用的主入口点，负责:
 * 1. 加载环境变量
 * 2. 创建Express应用实例
 * 3. 配置中间件（如CORS、请求解析等）
 * 4. 连接数据库
 * 5. 注册API路由
 * 6. 启动HTTP服务器
 */

// 加载环境变量
const dotenv = require('dotenv');
dotenv.config();

// 导入核心依赖
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const { initializeDatabase } = require('./src/config/seedData');
const ErrorResponse = require('./src/utils/errorResponse');

// 导入路由
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const projectRoutes = require('./src/routes/project.routes');
// const clientRoutes = require('./src/routes/client.routes'); // 暂不可用
// const employeeRoutes = require('./src/routes/employee.routes'); // 暂不可用
// const salaryRoutes = require('./src/routes/salary.routes'); // 暂不可用
// const attendanceRoutes = require('./src/routes/attendance.routes'); // 暂不可用
// const leaveRoutes = require('./src/routes/leave.routes'); // 暂不可用
const tempWorkRoutes = require('./src/routes/tempWork.routes');
const repairRoutes = require('./src/routes/repair.routes');
const quoteRoutes = require('./src/routes/quote.routes');
const receiptRoutes = require('./src/routes/receipt.routes');
// const contactRoutes = require('./src/routes/contact.routes'); // 暂不可用

// 创建Express应用
const app = express();

// 配置基础中间件
app.use(cors()); // 启用CORS以允许前端访问
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// 连接数据库并初始化
(async () => {
  try {
    // 连接数据库
    await connectDB();
    
    // 初始化数据库（创建测试账户等）
    await initializeDatabase();
  } catch (error) {
    console.error('数据库设置失败:', error);
  }
})();

// 基础API路由
app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用3XBANG建筑公司API',
    version: '1.0.0',
    status: 'online'
  });
});

// 注册API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/clients', clientRoutes); // 暂不可用
// app.use('/api/employees', employeeRoutes); // 暂不可用
// app.use('/api/salary', salaryRoutes); // 暂不可用
// app.use('/api/attendance', attendanceRoutes); // 暂不可用
// app.use('/api/leave', leaveRoutes); // 暂不可用
app.use('/api/client/temp-works', tempWorkRoutes);
app.use('/api/client/repairs', repairRoutes);
app.use('/api/client/quotes', quoteRoutes);
app.use('/api/client/receipts', receiptRoutes);
// app.use('/api/contact', contactRoutes); // 暂不可用

// 处理未找到的路由
app.use((req, res, next) => {
  next(new ErrorResponse(`找不到: ${req.originalUrl}`, 404));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // 如果是自定义错误响应，直接使用
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json(err.toJSON());
  }
  
  // 处理Mongoose验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message
      }
    });
  }
  
  // 处理Mongoose重复键错误
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'DUPLICATE_KEY',
        message: '该记录已存在'
      }
    });
  }
  
  // 默认服务器错误
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: '服务器内部错误'
    }
  });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器已在端口 ${PORT} 启动...`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
}); 