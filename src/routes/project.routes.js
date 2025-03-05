/**
 * 项目路由
 * 
 * 定义与项目管理相关的API端点:
 * - GET /api/projects - 获取所有项目
 * - GET /api/projects/:id - 获取单个项目
 * - POST /api/projects - 创建项目
 * - PUT /api/projects/:id - 更新项目
 * - DELETE /api/projects/:id - 删除项目
 */

const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// 获取所有项目和单个项目可以公开访问(有限数据)
router.get('/', getProjects);
router.get('/:id', getProject);

// 创建、更新和删除项目需要管理员权限
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router; 