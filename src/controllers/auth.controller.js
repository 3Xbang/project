/**
 * 认证控制器
 * 
 * 处理用户认证相关功能:
 * - 登录
 * - 登出
 * - 会话验证
 * - 用户注册
 */

const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * 用户登录
 * @route POST /api/auth/login
 * @access 公开
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return next(new ErrorResponse('请提供电子邮箱和密码', 400, 'INVALID_CREDENTIALS'));
    }

    // 查找用户并选择包含密码字段
    const user = await User.findOne({ email }).select('+password');

    // 用户不存在
    if (!user) {
      return next(new ErrorResponse('电子邮箱或密码不正确', 401, 'INVALID_CREDENTIALS'));
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('电子邮箱或密码不正确', 401, 'INVALID_CREDENTIALS'));
    }

    // 生成JWT令牌
    const token = user.getSignedJwtToken();

    // 获取用户公开信息
    const userInfo = user.getPublicProfile();

    // 返回成功响应
    res.status(200).json({
      success: true,
      data: {
        user: userInfo,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户注册
 * @route POST /api/auth/register
 * @access 公开
 */
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, company, phone } = req.body;

    // 验证输入
    if (!firstName || !lastName || !email || !password) {
      return next(new ErrorResponse('请提供姓名、电子邮箱和密码', 400, 'INVALID_INPUT'));
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('该电子邮箱已被注册', 400, 'EMAIL_EXISTS'));
    }

    // 准备用户数据
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'client',
      phone
    };

    // 根据角色添加特定字段
    if (role === 'client') {
      if (!company) {
        return next(new ErrorResponse('客户必须提供公司名称', 400, 'INVALID_INPUT'));
      }
      userData.company = company;
    } else if (['admin', 'manager', 'employee'].includes(role)) {
      if (!req.body.permissionLevel) {
        return next(new ErrorResponse('员工必须提供权限级别', 400, 'INVALID_INPUT'));
      }
      userData.permissionLevel = req.body.permissionLevel;
    }

    // 创建用户
    const user = await User.create(userData);

    // 生成JWT令牌
    const token = user.getSignedJwtToken();

    // 获取用户公开信息
    const userInfo = user.getPublicProfile();

    // 返回成功响应
    res.status(201).json({
      success: true,
      data: {
        user: userInfo,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登出
 * @route POST /api/auth/logout
 * @access 私有
 */
exports.logout = async (req, res, next) => {
  try {
    // 前端实际负责清除JWT令牌
    // 后端只需要返回成功响应
    res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证会话状态
 * @route GET /api/auth/session
 * @access 私有
 */
exports.getSession = async (req, res, next) => {
  try {
    // 由于auth中间件已经验证了用户身份，可以直接返回用户信息
    res.status(200).json({
      isAuthenticated: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}; 