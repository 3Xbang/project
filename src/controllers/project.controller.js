/**
 * 项目控制器
 * 
 * 处理项目相关功能:
 * - 获取项目列表
 * - 获取单个项目
 * - 创建项目
 * - 更新项目
 * - 删除项目
 */

const Project = require('../models/project.model');
const ErrorResponse = require('../utils/errorResponse');

/**
 * 获取所有项目
 * @route GET /api/projects
 * @access 公开(有限数据)/私有(完整数据)
 */
exports.getProjects = async (req, res, next) => {
  try {
    // 构建查询条件
    const query = {};
    
    // 如果指定了状态过滤
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // 如果是客户，只返回其关联的项目
    if (req.user && req.user.role === 'client') {
      query.client = req.user._id;
    }
    
    // 分页设置
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Project.countDocuments(query);
    
    // 执行查询
    const projects = await Project.find(query)
      .populate('client', 'firstName lastName company')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // 准备分页信息
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    // 如果用户未登录，返回有限数据
    const projectData = projects.map(project => {
      if (!req.user) {
        return project.getSummary();
      }
      return project;
    });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      pagination,
      data: {
        projects: projectData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个项目
 * @route GET /api/projects/:id
 * @access 公开(有限数据)/私有(完整数据)
 */
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'firstName lastName company')
      .populate('team', 'firstName lastName');
    
    if (!project) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的项目`, 404, 'NOT_FOUND'));
    }
    
    // 如果是客户，检查是否有权限访问
    if (req.user && req.user.role === 'client' && project.client._id.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('无权访问此项目', 403, 'FORBIDDEN'));
    }
    
    // 如果用户未登录，返回有限数据
    const projectData = !req.user ? project.getSummary() : project;
    
    res.status(200).json({
      success: true,
      data: {
        project: projectData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建项目
 * @route POST /api/projects
 * @access 私有(仅管理员)
 */
exports.createProject = async (req, res, next) => {
  try {
    // 创建项目
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新项目
 * @route PUT /api/projects/:id
 * @access 私有(仅管理员)
 */
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的项目`, 404, 'NOT_FOUND'));
    }
    
    // 更新项目
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除项目
 * @route DELETE /api/projects/:id
 * @access 私有(仅管理员)
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return next(new ErrorResponse(`未找到ID为${req.params.id}的项目`, 404, 'NOT_FOUND'));
    }
    
    // 删除项目
    await project.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取客户项目
 * @route GET /api/client/projects
 * @access 私有(客户)
 */
exports.getClientProjects = async (req, res, next) => {
  try {
    // 查询客户关联的项目
    const projects = await Project.find({ client: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: {
        projects
      }
    });
  } catch (error) {
    next(error);
  }
}; 