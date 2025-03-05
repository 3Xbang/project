/**
 * 3XBANG建筑公司前端API服务
 * 
 * 该文件为前端应用提供了与后端API通信的核心功能
 * 包括：
 * - 创建基本的API客户端
 * - 配置请求/响应拦截器
 * - 处理认证令牌
 * - 错误处理
 */

import axios from 'axios';

// API基础URL，可以根据环境变量配置
const API_URL = process.env.VUE_APP_API_URL || 'http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173';

/**
 * 创建API客户端实例
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 请求超时时间：10秒
});

/**
 * 请求拦截器
 * 在每个请求发送前自动添加认证令牌
 */
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取令牌
    const token = localStorage.getItem('token');
    // 如果存在令牌，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 处理常见的响应错误，如令牌过期
 */
apiClient.interceptors.response.use(
  (response) => {
    // 如果响应成功，直接返回数据部分
    return response.data;
  },
  (error) => {
    // 处理401未授权错误（如令牌过期）
    if (error.response && error.response.status === 401) {
      // 清除本地存储的令牌
      localStorage.removeItem('token');
      // 重定向到登录页面
      window.location.href = '/login';
    }
    
    // 返回格式化的错误信息
    return Promise.reject({
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error?.message : '服务器错误',
      code: error.response ? error.response.data.error?.code : 'SERVER_ERROR',
      data: error.response ? error.response.data : null
    });
  }
);

export default apiClient; 