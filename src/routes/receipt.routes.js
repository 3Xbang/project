/**
 * 收据路由
 * 
 * 定义与收据相关的API端点:
 * - GET /api/client/receipts - 获取客户的收据列表
 * - GET /api/client/receipts/:id - 获取单个收据
 * - POST /api/client/receipts - 创建收据(管理员)
 * - PUT /api/client/receipts/:id - 更新收据(管理员)
 * - DELETE /api/client/receipts/:id - 删除收据(管理员)
 */

const express = require('express');
const {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt
} = require('../controllers/receipt.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// 所有路由都需要身份验证
router.use(protect);

// 获取列表(客户)和创建(管理员)
router
  .route('/')
  .get(authorize('client'), getReceipts)
  .post(authorize('admin', 'manager'), createReceipt);

// 获取单个(客户)、更新和删除(管理员)
router
  .route('/:id')
  .get(authorize('client'), getReceipt)
  .put(authorize('admin', 'manager'), updateReceipt)
  .delete(authorize('admin'), deleteReceipt);

module.exports = router; 