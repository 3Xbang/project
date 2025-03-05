/**
 * 报价服务
 * 
 * 提供与报价相关的功能:
 * - 获取报价列表
 * - 获取单个报价
 * - 创建报价(管理员/经理)
 * - 确认报价(客户)
 * - 更新报价(管理员/经理)
 * - 删除报价(管理员)
 */

import api from '../api';

/**
 * 获取报价列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.sort - 排序方式
 * @param {string} params.status - 状态过滤
 * @returns {Promise} - 返回报价列表
 */
const getQuotes = async (params = {}) => {
  try {
    return await api.get('/api/client/quotes', { params });
  } catch (error) {
    throw error;
  }
};

/**
 * 获取单个报价
 * @param {string} id - 报价ID
 * @returns {Promise} - 返回报价信息
 */
const getQuote = async (id) => {
  try {
    return await api.get(`/api/client/quotes/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * 创建报价(管理员/经理)
 * @param {Object} quoteData - 报价数据
 * @returns {Promise} - 返回创建的报价
 */
const createQuote = async (quoteData) => {
  try {
    return await api.post('/api/client/quotes', quoteData);
  } catch (error) {
    throw error;
  }
};

/**
 * 确认报价(客户)
 * @param {string} id - 报价ID
 * @param {Object} confirmationData - 确认信息
 * @param {string} confirmationData.confirmationNote - 确认备注
 * @returns {Promise} - 返回确认后的报价
 */
const confirmQuote = async (id, confirmationData) => {
  try {
    return await api.put(`/api/client/quotes/${id}/confirm`, confirmationData);
  } catch (error) {
    throw error;
  }
};

/**
 * 更新报价(管理员/经理)
 * @param {string} id - 报价ID
 * @param {Object} quoteData - 更新的报价数据
 * @returns {Promise} - 返回更新后的报价
 */
const updateQuote = async (id, quoteData) => {
  try {
    return await api.put(`/api/client/quotes/${id}`, quoteData);
  } catch (error) {
    throw error;
  }
};

/**
 * 删除报价(管理员)
 * @param {string} id - 报价ID
 * @returns {Promise} - 返回删除结果
 */
const deleteQuote = async (id) => {
  try {
    return await api.delete(`/api/client/quotes/${id}`);
  } catch (error) {
    throw error;
  }
};

export default {
  getQuotes,
  getQuote,
  createQuote,
  confirmQuote,
  updateQuote,
  deleteQuote
}; 