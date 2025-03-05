/**
 * 项目服务
 * 
 * 提供与项目管理相关的功能:
 * - 获取项目列表
 * - 获取单个项目
 * - 创建项目(管理员)
 * - 更新项目(管理员)
 * - 删除项目(管理员)
 */

import api from '../api';

/**
 * 获取项目列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.sort - 排序方式
 * @param {string} params.search - 搜索关键词
 * @param {string} params.status - 状态过滤
 * @returns {Promise} - 返回项目列表
 */
const getProjects = async (params = {}) => {
  try {
    return await api.get('/api/projects', { params });
  } catch (error) {
    throw error;
  }
};

/**
 * 获取单个项目
 * @param {string} id - 项目ID
 * @returns {Promise} - 返回项目信息
 */
const getProject = async (id) => {
  try {
    return await api.get(`/api/projects/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * 创建项目(管理员)
 * @param {Object} projectData - 项目数据
 * @returns {Promise} - 返回创建的项目
 */
const createProject = async (projectData) => {
  try {
    return await api.post('/api/projects', projectData);
  } catch (error) {
    throw error;
  }
};

/**
 * 更新项目(管理员)
 * @param {string} id - 项目ID
 * @param {Object} projectData - 更新的项目数据
 * @returns {Promise} - 返回更新后的项目
 */
const updateProject = async (id, projectData) => {
  try {
    return await api.put(`/api/projects/${id}`, projectData);
  } catch (error) {
    throw error;
  }
};

/**
 * 删除项目(管理员)
 * @param {string} id - 项目ID
 * @returns {Promise} - 返回删除结果
 */
const deleteProject = async (id) => {
  try {
    return await api.delete(`/api/projects/${id}`);
  } catch (error) {
    throw error;
  }
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
}; 