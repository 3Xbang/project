/**
 * 收据控制器
 * 
 * 提供以下功能:
 * - 获取客户的收据列表
 * - 获取单个收据详情
 * - 创建收据(管理员)
 * - 更新收据(管理员)
 * - 删除收据(管理员)
 */

const Receipt = require('../models/receipt.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    获取客户的收据列表
 * @route   GET /api/client/receipts
 * @access  Private (Client)
 */
exports.getReceipts = async (req, res, next) => {
  try {
    // 查找与当前客户关联的所有收据
    const receipts = await Receipt.find({ client: req.user.id })
      .sort({ createdAt: -1 }); // 按创建日期降序排序

    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    获取单个收据
 * @route   GET /api/client/receipts/:id
 * @access  Private (Client)
 */
exports.getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的收据`, 404));
    }

    // 确保客户只能查看自己的收据
    if (receipt.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('无权访问此资源', 403));
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    创建收据
 * @route   POST /api/client/receipts
 * @access  Private (Admin)
 */
exports.createReceipt = async (req, res, next) => {
  try {
    // 设置创建者为当前管理员
    req.body.createdBy = req.user.id;
    
    // 生成收据编号
    req.body.receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

    const receipt = await Receipt.create(req.body);

    res.status(201).json({
      success: true,
      data: receipt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    更新收据
 * @route   PUT /api/client/receipts/:id
 * @access  Private (Admin)
 */
exports.updateReceipt = async (req, res, next) => {
  try {
    let receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的收据`, 404));
    }

    // 不允许修改收据编号
    if (req.body.receiptNumber) {
      delete req.body.receiptNumber;
    }

    // 更新收据信息
    receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    删除收据
 * @route   DELETE /api/client/receipts/:id
 * @access  Private (Admin)
 */
exports.deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的收据`, 404));
    }

    await receipt.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 