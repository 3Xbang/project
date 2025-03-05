/**
 * 数据库连接配置文件
 * 
 * 负责配置与MongoDB的连接，使用mongoose库
 */

const mongoose = require('mongoose');

/**
 * 连接到MongoDB数据库
 * 使用环境变量中的连接URI
 */
const connectDB = async () => {
  try {
    // 使用环境变量中的连接URI
    const connectionString = process.env.MONGO_URI;
    
    // 配置连接选项
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    // 连接到数据库
    const conn = await mongoose.connect(connectionString, options);
    
    console.log(`MongoDB已连接: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB连接失败: ${error.message}`);
    // 严重错误，退出进程
    process.exit(1);
  }
};

module.exports = { connectDB }; 