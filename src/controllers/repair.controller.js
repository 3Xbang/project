/**
 * 维修申请控制器
 * 
 * 处理维修申请相关功能:
 * - 获取维修申请列表
 * - 获取维修申请统计
 * - 获取单个维修申请
 * - 创建维修申请
 * - 更新维修申请状态
 * - 删除维修申请
 */

const Repair = require('../models/repair.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * 获取客户的维修申请列表
 * @route GET /api/client/repairs
 * @access 私有(客户)
 */
exports.getRepairs = async (req, res, next) => {
  try {
    // 查询客户关联的维修申请
    const repairs = await Repair.find({ clientId: req.user._id })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: repairs.length,
      data: {
        repairs
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取维修申请统计
 * @route GET /api/client/repairs/stats
 * @access 私有(客户)
 */
exports.getRepairStats = async (req, res, next) => {
  try {
    // 获取维修申请统计
    const stats = await Repair.getStats(req.user._id);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个维修申请
 * @route GET /api/client/repairs/:id
 * @access 私有(客户)
 */
exports.getRepair = async (req, res, next) => {
  try {
    const repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的维修申请`, 404, 'NOT_FOUND'));
    }
    
    // 检查是否是客户本人的申请
    if (repair.clientId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('无权访问此资源', 403, 'FORBIDDEN'));
    }
    
    res.status(200).json({
      success: true,
      data: {
        repair
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建维修申请
 * @route POST /api/client/repairs
 * @access 私有(客户)
 */
exports.createRepair = async (req, res, next) => {
  try {
    // 添加客户ID
    req.body.clientId = req.user._id;
    
    // 创建维修申请
    const repair = await Repair.create(req.body);
    
    res.status(201).json({
      success: true,
      data: {
        repair
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新维修申请状态(管理员)
 * @route PUT /api/client/repairs/:id
 * @access 私有(管理员)
 */
exports.updateRepair = async (req, res, next) => {
  try {
    let repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的维修申请`, 404, 'NOT_FOUND'));
    }
    
    // 如果是分配维修人员，记录分配信息
    if (req.body.assignedTo) {
      req.body.scheduledDate = req.body.scheduledDate || new Date();
    }
    
    // 更新维修申请
    repair = await Repair.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        repair
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除维修申请(管理员)
 * @route DELETE /api/client/repairs/:id
 * @access 私有(管理员)
 */
exports.deleteRepair = async (req, res, next) => {
  try {
    const repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的维修申请`, 404, 'NOT_FOUND'));
    }
    
    // 删除维修申请
    await repair.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};