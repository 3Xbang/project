/**
 * 维修申请路由
 * 
 * 定义与维修申请相关的API端点:
 * - GET /api/client/repairs - 获取客户的维修申请列表
 * - GET /api/client/repairs/stats - 获取维修申请统计
 * - GET /api/client/repairs/:id - 获取单个维修申请
 * - POST /api/client/repairs - 创建维修申请
 * - PUT /api/client/repairs/:id - 更新维修申请状态(管理员)
 * - DELETE /api/client/repairs/:id - 删除维修申请(管理员)
 */

const express = require('express');
const {
  getRepairs,
  getRepairStats,
  getRepair,
  createRepair,
  updateRepair,
  deleteRepair
} = require('../controllers/repair.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// 所有路由都需要身份验证
router.use(protect);

// 获取维修申请统计
router.get('/stats', authorize('client'), getRepairStats);

// 获取列表和创建申请(客户)
router
  .route('/')
  .get(authorize('client'), getRepairs)
  .post(authorize('client'), createRepair);

// 获取单个、更新和删除
router
  .route('/:id')
  .get(authorize('client'), getRepair)
  .put(authorize('admin', 'manager'), updateRepair)
  .delete(authorize('admin'), deleteRepair);

module.exports = router; 