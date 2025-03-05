/**
 * 临时施工路由
 * 
 * 定义与临时施工相关的API端点:
 * - GET /api/client/temp-works - 获取客户的临时施工列表
 * - GET /api/client/temp-works/:id - 获取单个临时施工
 * - POST /api/client/temp-works - 创建临时施工申请
 * - PUT /api/client/temp-works/:id - 更新临时施工状态(管理员)
 * - DELETE /api/client/temp-works/:id - 删除临时施工(管理员)
 */

const express = require('express');
const {
  getTempWorks,
  getTempWork,
  createTempWork,
  updateTempWork,
  deleteTempWork
} = require('../controllers/tempWork.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// 所有路由都需要身份验证
router.use(protect);

// 获取列表和创建申请(客户)
router
  .route('/')
  .get(authorize('client'), getTempWorks)
  .post(authorize('client'), createTempWork);

// 获取单个、更新和删除
router
  .route('/:id')
  .get(authorize('client'), getTempWork)
  .put(authorize('admin', 'manager'), updateTempWork)
  .delete(authorize('admin'), deleteTempWork);

module.exports = router; 