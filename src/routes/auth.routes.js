/**
 * 认证路由
 * 
 * 定义与用户认证相关的API端点:
 * - POST /api/auth/login - 用户登录
 * - POST /api/auth/logout - 用户登出
 * - GET /api/auth/check-session - 检查会话状态
 * - POST /api/auth/register - 用户注册
 */

const express = require('express');
const { login, logout, getSession, register } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// 登录不需要身份验证
router.post('/login', login);

// 登出和会话检查需要身份验证
router.post('/logout', protect, logout);
router.get('/check-session', protect, getSession);

// 注册路由
router.post('/register', register);

module.exports = router; 