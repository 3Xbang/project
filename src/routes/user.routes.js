/**
 * 用户路由
 * 
 * 定义与用户管理相关的API端点:
 * - GET /api/users - 获取所有用户
 * - GET /api/users/:id - 获取单个用户
 * - POST /api/users - 创建用户
 * - PUT /api/users/:id - 更新用户
 * - DELETE /api/users/:id - 删除用户
 */

const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// 所有用户路由都需要身份验证
router.use(protect);

// 获取所有用户和创建用户仅限管理员
router
  .route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

// 获取、更新和删除单个用户
router
  .route('/:id')
  .get(getUser) // 在控制器中检查权限(管理员或本人)
  .put(updateUser) // 在控制器中检查权限(管理员或本人)
  .delete(authorize('admin'), deleteUser); // 仅限管理员

module.exports = router; 