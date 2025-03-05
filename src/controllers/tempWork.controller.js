/**
 * 临时施工控制器
 * 
 * 提供以下功能:
 * - 获取客户的临时施工列表
 * - 获取单个临时施工详情
 * - 创建临时施工申请
 * - 更新临时施工状态(管理员)
 * - 删除临时施工(管理员)
 */

const TempWork = require('../models/tempWork.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    获取客户的临时施工列表
 * @route   GET /api/client/temp-works
 * @access  Private (Client)
 */
exports.getTempWorks = async (req, res, next) => {
  try {
    // 查找与当前客户关联的所有临时施工
    const tempWorks = await TempWork.find({ client: req.user.id })
      .sort({ createdAt: -1 }); // 按创建日期降序排序

    res.status(200).json({
      success: true,
      count: tempWorks.length,
      data: tempWorks
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    获取单个临时施工
 * @route   GET /api/client/temp-works/:id
 * @access  Private (Client)
 */
exports.getTempWork = async (req, res, next) => {
  try {
    const tempWork = await TempWork.findById(req.params.id);

    if (!tempWork) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的临时施工`, 404));
    }

    // 确保客户只能查看自己的临时施工
    if (tempWork.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('无权访问此资源', 403));
    }

    res.status(200).json({
      success: true,
      data: tempWork
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    创建临时施工申请
 * @route   POST /api/client/temp-works
 * @access  Private (Client)
 */
exports.createTempWork = async (req, res, next) => {
  try {
    // 将客户ID添加到请求体
    req.body.client = req.user.id;
    
    // 设置初始状态为"待审核"
    req.body.status = '待审核';

    const tempWork = await TempWork.create(req.body);

    res.status(201).json({
      success: true,
      data: tempWork
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    更新临时施工状态
 * @route   PUT /api/client/temp-works/:id
 * @access  Private (Admin)
 */
exports.updateTempWork = async (req, res, next) => {
  try {
    let tempWork = await TempWork.findById(req.params.id);

    if (!tempWork) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的临时施工`, 404));
    }

    // 更新临时施工信息
    tempWork = await TempWork.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: tempWork
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    删除临时施工
 * @route   DELETE /api/client/temp-works/:id
 * @access  Private (Admin)
 */
exports.deleteTempWork = async (req, res, next) => {
  try {
    const tempWork = await TempWork.findById(req.params.id);

    if (!tempWork) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的临时施工`, 404));
    }

    await tempWork.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 