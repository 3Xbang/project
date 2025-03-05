/**
 * 认证服务
 * 
 * 提供与用户认证相关的功能:
 * - 登录
 * - 登出
 * - 获取当前会话
 * - 检查认证状态
 */

import api from '../api';

/**
 * 用户登录
 * @param {Object} credentials - 用户凭证
 * @param {string} credentials.email - 用户邮箱
 * @param {string} credentials.password - 用户密码
 * @returns {Promise} - 返回包含token和用户信息的Promise
 */
const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    
    // 如果登录成功，保存token到localStorage
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 用户登出
 * @returns {Promise} - 返回登出操作的结果
 */
const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    
    // 无论服务器响应如何，清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return response;
  } catch (error) {
    // 即使请求失败，也要清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * 获取当前会话信息
 * @returns {Promise} - 返回当前用户会话信息
 */
const getSession = async () => {
  try {
    return await api.get('/api/auth/session');
  } catch (error) {
    throw error;
  }
};

/**
 * 检查用户是否已认证
 * @returns {boolean} - 是否已认证
 */
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * 获取当前用户信息
 * @returns {Object|null} - 当前用户信息或null
 */
const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * 检查用户是否有特定角色
 * @param {string|string[]} roles - 角色或角色数组
 * @returns {boolean} - 是否有指定角色
 */
const hasRole = (roles) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // 如果roles是数组，检查用户角色是否在数组中
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  // 如果roles是字符串，直接比较
  return user.role === roles;
};

export default {
  login,
  logout,
  getSession,
  isAuthenticated,
  getCurrentUser,
  hasRole
}; 