/**
 * 用户控制器
 * 
 * 处理用户相关功能:
 * - 获取用户列表
 * - 获取单个用户
 * - 创建用户
 * - 更新用户
 * - 删除用户
 */

const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * 获取所有用户
 * @route GET /api/users
 * @access 私有(仅管理员)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    // 返回用户列表(不包含密码)
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个用户
 * @route GET /api/users/:id
 * @access 私有(仅管理员或本人)
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的用户`, 404, 'NOT_FOUND'));
    }
    
    // 检查权限(仅管理员或本人可访问)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return next(new ErrorResponse('无权访问此资源', 403, 'FORBIDDEN'));
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建用户
 * @route POST /api/users
 * @access 私有(仅管理员)
 */
exports.createUser = async (req, res, next) => {
  try {
    // 创建用户
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户
 * @route PUT /api/users/:id
 * @access 私有(仅管理员或本人)
 */
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的用户`, 404, 'NOT_FOUND'));
    }
    
    // 检查权限(仅管理员或本人可更新)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return next(new ErrorResponse('无权更新此用户', 403, 'FORBIDDEN'));
    }
    
    // 如果不是管理员，不允许更改角色
    if (req.user.role !== 'admin' && req.body.role) {
      delete req.body.role;
    }
    
    // 更新用户
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除用户
 * @route DELETE /api/users/:id
 * @access 私有(仅管理员)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的用户`, 404, 'NOT_FOUND'));
    }
    
    // 删除用户
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 