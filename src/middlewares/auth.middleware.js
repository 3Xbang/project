/**
 * 权限验证中间件
 * 
 * 用于验证API请求的权限:
 * 1. 验证用户是否已登录(JWT有效性)
 * 2. 验证用户是否有特定角色权限
 */

const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user.model');

/**
 * 验证用户是否已登录
 * 验证请求头部的Bearer Token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 检查请求头部是否包含授权信息
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // 从Bearer Token中获取令牌
      token = req.headers.authorization.split(' ')[1];
    } 

    // 如果没有找到令牌
    if (!token) {
      return next(new ErrorResponse('需要登录才能访问此资源', 401, 'UNAUTHORIZED'));
    }

    try {
      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 验证通过后，从数据库获取用户信息
      const user = await User.findById(decoded.id);
      
      // 如果用户不存在
      if (!user) {
        return next(new ErrorResponse('找不到与此令牌关联的用户', 401, 'UNAUTHORIZED'));
      }

      // 将用户信息添加到请求对象中，以便后续处理
      req.user = user;
      next();
    } catch (error) {
      // JWT验证失败
      return next(new ErrorResponse('登录会话已过期，请重新登录', 401, 'UNAUTHORIZED'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 验证用户角色权限
 * @param {...string} roles - 允许访问的角色列表
 * @returns {Function} Express中间件
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // 验证用户角色是否在允许的角色列表中
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`${req.user.role}角色无权访问此资源`, 403, 'FORBIDDEN'));
    }
    next();
  };
}; 