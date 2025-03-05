/**
 * 维修申请服务
 * 
 * 提供与维修申请相关的功能:
 * - 获取维修申请列表
 * - 获取维修申请统计
 * - 获取单个维修申请
 * - 创建维修申请
 * - 更新维修申请(管理员/经理)
 * - 删除维修申请(管理员)
 */

import api from '../api';

/**
 * 获取维修申请列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.sort - 排序方式
 * @param {string} params.status - 状态过滤
 * @returns {Promise} - 返回维修申请列表
 */
const getRepairs = async (params = {}) => {
  try {
    return await api.get('/api/client/repairs', { params });
  } catch (error) {
    throw error;
  }
};

/**
 * 获取维修申请统计
 * @returns {Promise} - 返回维修申请统计
 */
const getRepairStats = async () => {
  try {
    return await api.get('/api/client/repairs/stats');
  } catch (error) {
    throw error;
  }
};

/**
 * 获取单个维修申请
 * @param {string} id - 维修申请ID
 * @returns {Promise} - 返回维修申请信息
 */
const getRepair = async (id) => {
  try {
    return await api.get(`/api/client/repairs/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * 创建维修申请
 * @param {Object} repairData - 维修申请数据
 * @returns {Promise} - 返回创建的维修申请
 */
const createRepair = async (repairData) => {
  try {
    return await api.post('/api/client/repairs', repairData);
  } catch (error) {
    throw error;
  }
};

/**
 * 更新维修申请(管理员/经理)
 * @param {string} id - 维修申请ID
 * @param {Object} repairData - 更新的维修申请数据
 * @returns {Promise} - 返回更新后的维修申请
 */
const updateRepair = async (id, repairData) => {
  try {
    return await api.put(`/api/client/repairs/${id}`, repairData);
  } catch (error) {
    throw error;
  }
};

/**
 * 删除维修申请(管理员)
 * @param {string} id - 维修申请ID
 * @returns {Promise} - 返回删除结果
 */
const deleteRepair = async (id) => {
  try {
    return await api.delete(`/api/client/repairs/${id}`);
  } catch (error) {
    throw error;
  }
};

export default {
  getRepairs,
  getRepairStats,
  getRepair,
  createRepair,
  updateRepair,
  deleteRepair
}; 