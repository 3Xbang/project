/**
 * 报价控制器
 * 
 * 处理报价相关功能:
 * - 获取报价列表
 * - 获取单个报价
 * - 创建报价
 * - 确认报价
 * - 更新报价
 * - 删除报价
 */

const Quote = require('../models/quote.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * 获取客户的报价列表
 * @route GET /api/client/quotes
 * @access 私有(客户)
 */
exports.getQuotes = async (req, res, next) => {
  try {
    // 查询客户关联的报价
    const quotes = await Quote.find({ clientId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: quotes.length,
      data: {
        quotes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个报价
 * @route GET /api/client/quotes/:id
 * @access 私有(客户)
 */
exports.getQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的报价`, 404, 'NOT_FOUND'));
    }
    
    // 检查是否是客户本人的报价
    if (quote.clientId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('无权访问此资源', 403, 'FORBIDDEN'));
    }
    
    res.status(200).json({
      success: true,
      data: {
        quote
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建报价(管理员)
 * @route POST /api/client/quotes
 * @access 私有(管理员)
 */
exports.createQuote = async (req, res, next) => {
  try {
    // 添加创建者ID
    req.body.createdBy = req.user._id;
    
    // 创建报价
    const quote = await Quote.create(req.body);
    
    res.status(201).json({
      success: true,
      data: {
        quote
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 确认报价(客户)
 * @route PUT /api/client/quotes/:id/confirm
 * @access 私有(客户)
 */
exports.confirmQuote = async (req, res, next) => {
  try {
    let quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的报价`, 404, 'NOT_FOUND'));
    }
    
    // 检查是否是客户本人的报价
    if (quote.clientId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('无权确认此报价', 403, 'FORBIDDEN'));
    }
    
    // 检查报价是否已过期
    if (quote.status === 'expired') {
      return next(new ErrorResponse('此报价已过期', 400, 'QUOTE_EXPIRED'));
    }
    
    // 检查报价是否已确认
    if (quote.status === 'confirmed') {
      return next(new ErrorResponse('此报价已确认', 400, 'QUOTE_ALREADY_CONFIRMED'));
    }
    
    // 更新报价状态为已确认
    quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        quote
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新报价(管理员)
 * @route PUT /api/client/quotes/:id
 * @access 私有(管理员)
 */
exports.updateQuote = async (req, res, next) => {
  try {
    let quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的报价`, 404, 'NOT_FOUND'));
    }
    
    // 检查报价是否已确认，已确认的报价不能修改
    if (quote.status === 'confirmed') {
      return next(new ErrorResponse('已确认的报价不能修改', 400, 'QUOTE_CONFIRMED'));
    }
    
    // 更新报价
    quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        quote
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除报价(管理员)
 * @route DELETE /api/client/quotes/:id
 * @access 私有(管理员)
 */
exports.deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的报价`, 404, 'NOT_FOUND'));
    }
    
    // 检查报价是否已确认，已确认的报价不能删除
    if (quote.status === 'confirmed') {
      return next(new ErrorResponse('已确认的报价不能删除', 400, 'QUOTE_CONFIRMED'));
    }
    
    // 删除报价
    await quote.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 