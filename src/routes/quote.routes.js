/**
 * 报价路由
 * 
 * 定义与报价相关的API端点:
 * - GET /api/client/quotes - 获取客户的报价列表
 * - GET /api/client/quotes/:id - 获取单个报价
 * - POST /api/client/quotes - 创建报价(管理员)
 * - PUT /api/client/quotes/:id/confirm - 确认报价(客户)
 * - PUT /api/client/quotes/:id - 更新报价(管理员)
 * - DELETE /api/client/quotes/:id - 删除报价(管理员)
 */

const express = require('express');
const {
  getQuotes,
  getQuote,
  createQuote,
  confirmQuote,
  updateQuote,
  deleteQuote
} = require('../controllers/quote.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// 所有路由都需要身份验证
router.use(protect);

// 确认报价
router.put('/:id/confirm', authorize('client'), confirmQuote);

// 获取列表(客户)和创建(管理员)
router
  .route('/')
  .get(authorize('client'), getQuotes)
  .post(authorize('admin', 'manager'), createQuote);

// 获取单个(客户)、更新和删除(管理员)
router
  .route('/:id')
  .get(authorize('client'), getQuote)
  .put(authorize('admin', 'manager'), updateQuote)
  .delete(authorize('admin'), deleteQuote);

module.exports = router;