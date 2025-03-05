# 3XBANG建筑公司前端API集成

此目录包含了与3XBANG建筑公司后端API进行集成的服务文件。前端开发人员可以使用这些服务来轻松地与后端API进行通信。

## 目录结构

```
src/frontend-integration/
├── api.js              # 核心API客户端
├── index.js            # 服务导出入口
├── services/           # 服务模块
│   ├── auth.service.js    # 认证服务
│   ├── project.service.js # 项目服务
│   ├── repair.service.js  # 维修申请服务
│   └── quote.service.js   # 报价服务
└── README.md           # 说明文档
```

## 快速开始

### 安装依赖

确保你的项目已安装 `axios`：

```bash
npm install axios
```

### 集成到Vue项目

1. 将整个 `frontend-integration` 目录复制到你的Vue项目中

2. 在你的Vue项目的 `main.js` 中配置API服务：

```javascript
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import apiServices from './frontend-integration';

// 全局注册API服务
Vue.prototype.$api = apiServices;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
```

3. 在组件中使用API服务：

```javascript
export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await this.$api.auth.login({
          email: this.email,
          password: this.password
        });
        
        // 登录成功，重定向到仪表盘
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = error.message || '登录失败，请检查凭证';
      } finally {
        this.loading = false;
      }
    }
  }
};
```

## 通用API服务

`api.js` 文件提供了一个基础的API客户端，它：

- 自动处理JWT认证令牌
- 处理常见的错误情况
- 提供统一的错误格式
- 简化API请求

## 可用服务

### 认证服务 (`auth.service.js`)

提供用户认证相关功能：

- `login(credentials)` - 用户登录
- `logout()` - 用户登出 
- `getSession()` - 获取当前会话
- `isAuthenticated()` - 检查用户是否已认证
- `getCurrentUser()` - 获取当前用户
- `hasRole(roles)` - 检查用户是否有特定角色

### 项目服务 (`project.service.js`)

提供项目管理相关功能：

- `getProjects(params)` - 获取项目列表
- `getProject(id)` - 获取单个项目
- `createProject(projectData)` - 创建项目
- `updateProject(id, projectData)` - 更新项目
- `deleteProject(id)` - 删除项目

### 维修申请服务 (`repair.service.js`) 

提供维修申请相关功能：

- `getRepairs(params)` - 获取维修申请列表
- `getRepairStats()` - 获取维修申请统计
- `getRepair(id)` - 获取单个维修申请
- `createRepair(repairData)` - 创建维修申请
- `updateRepair(id, repairData)` - 更新维修申请
- `deleteRepair(id)` - 删除维修申请

### 报价服务 (`quote.service.js`)

提供报价相关功能：

- `getQuotes(params)` - 获取报价列表
- `getQuote(id)` - 获取单个报价
- `createQuote(quoteData)` - 创建报价
- `confirmQuote(id, confirmationData)` - 确认报价
- `updateQuote(id, quoteData)` - 更新报价
- `deleteQuote(id)` - 删除报价

## 错误处理

所有API服务方法都返回Promise，可以使用async/await或then/catch来处理：

```javascript
// 使用async/await
async function fetchProjects() {
  try {
    const result = await this.$api.projects.getProjects();
    // 处理成功响应
    console.log(result.data);
  } catch (error) {
    // 处理错误
    console.error(error.message);
  }
}

// 使用Promise链
this.$api.projects.getProjects()
  .then(result => {
    // 处理成功响应
    console.log(result.data);
  })
  .catch(error => {
    // 处理错误
    console.error(error.message);
  });
```

## 自定义配置

如果需要自定义API URL或其他配置，可以在项目根目录的`.env`文件中设置：

```
VUE_APP_API_URL=http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173
``` 