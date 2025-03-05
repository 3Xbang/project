/**
 * 3XBANG建筑公司API服务集成
 * 
 * 此文件导出所有API服务，以便前端应用使用。
 */

// 导入核心API客户端
import apiClient from './api';

// 导入各个服务模块
import authService from './services/auth.service';
import projectService from './services/project.service';
import repairService from './services/repair.service';
import quoteService from './services/quote.service';

// 导出服务模块
export const api = apiClient;
export const auth = authService;
export const projects = projectService;
export const repairs = repairService;
export const quotes = quoteService;

// 默认导出所有服务
export default {
  api: apiClient,
  auth: authService,
  projects: projectService,
  repairs: repairService,
  quotes: quoteService
}; 