# 3XBANG建筑公司后端项目结构

## 项目概述

本项目是3XBANG建筑公司的后端API系统，使用Node.js、Express和MongoDB开发，提供用户认证、项目管理、客户服务等功能。

## 目录结构

```
project/
├── server.js              # 主入口文件
├── .env                   # 环境变量配置
├── package.json           # 项目依赖
├── src/
│   ├── config/            # 配置文件
│   │   ├── db.js          # 数据库连接
│   │   └── seedData.js    # 数据库初始化种子数据
│   ├── controllers/       # 控制器
│   │   ├── auth.controller.js       # 认证控制器
│   │   ├── user.controller.js       # 用户控制器
│   │   ├── project.controller.js    # 项目控制器
│   │   ├── tempWork.controller.js   # 临时施工控制器
│   │   ├── repair.controller.js     # 维修申请控制器
│   │   ├── quote.controller.js      # 报价控制器
│   │   ├── receipt.controller.js    # 收据控制器
│   │   ├── salary.controller.js     # 工资控制器
│   │   ├── attendance.controller.js # 考勤控制器
│   │   ├── leave.controller.js      # 请假控制器
│   │   └── contact.controller.js    # 联系表单控制器
│   ├── middlewares/       # 中间件
│   │   └── auth.middleware.js       # 认证中间件
│   ├── models/            # 数据模型
│   │   ├── user.model.js            # 用户模型
│   │   ├── project.model.js         # 项目模型
│   │   ├── tempWork.model.js        # 临时施工模型
│   │   ├── repair.model.js          # 维修申请模型
│   │   ├── quote.model.js           # 报价模型
│   │   ├── receipt.model.js         # 收据模型
│   │   ├── salary.model.js          # 工资模型
│   │   ├── attendance.model.js      # 考勤模型
│   │   ├── leave.model.js           # 请假模型
│   │   └── contact.model.js         # 联系表单模型
│   ├── routes/            # 路由
│   │   ├── auth.routes.js           # 认证路由
│   │   ├── user.routes.js           # 用户路由
│   │   ├── project.routes.js        # 项目路由
│   │   ├── tempWork.routes.js       # 临时施工路由
│   │   ├── repair.routes.js         # 维修申请路由
│   │   ├── quote.routes.js          # 报价路由
│   │   ├── receipt.routes.js        # 收据路由
│   │   ├── salary.routes.js         # 工资路由
│   │   ├── attendance.routes.js     # 考勤路由
│   │   ├── leave.routes.js          # 请假路由
│   │   └── contact.routes.js        # 联系表单路由
│   └── utils/             # 工具函数
│       └── errorResponse.js         # 错误响应处理
└── node_modules/          # 依赖包
```

## 模块关系图

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Routes    │──────▶ Controllers │──────▶   Models    │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Middlewares │      │   Utils     │      │  Database   │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 主要模块说明

### 1. 用户认证模块

负责用户注册、登录、权限验证等功能。

**相关文件:**
- src/controllers/auth.controller.js
- src/routes/auth.routes.js
- src/middlewares/auth.middleware.js
- src/models/user.model.js

### 2. 项目管理模块

管理建筑项目信息，包括项目创建、更新、查询等。

**相关文件:**
- src/controllers/project.controller.js
- src/routes/project.routes.js
- src/models/project.model.js

### 3. 临时施工模块

处理客户临时施工申请，包括申请创建、状态更新等。

**相关文件:**
- src/controllers/tempWork.controller.js
- src/routes/tempWork.routes.js
- src/models/tempWork.model.js

### 4. 维修申请模块

处理客户维修申请，包括申请创建、状态更新等。

**相关文件:**
- src/controllers/repair.controller.js
- src/routes/repair.routes.js
- src/models/repair.model.js

### 5. 报价管理模块

管理项目报价，包括创建、确认、更新等。

**相关文件:**
- src/controllers/quote.controller.js
- src/routes/quote.routes.js
- src/models/quote.model.js

### 6. 收据管理模块

管理客户付款收据，包括创建、查询等。

**相关文件:**
- src/controllers/receipt.controller.js
- src/routes/receipt.routes.js
- src/models/receipt.model.js

### 7. 员工管理模块

包括工资、考勤、请假等子模块，管理员工相关信息。

**相关文件:**
- src/controllers/salary.controller.js
- src/routes/salary.routes.js
- src/models/salary.model.js
- src/controllers/attendance.controller.js
- src/routes/attendance.routes.js
- src/models/attendance.model.js
- src/controllers/leave.controller.js
- src/routes/leave.routes.js
- src/models/leave.model.js

### 8. 联系表单模块

处理网站访客提交的联系表单。

**相关文件:**
- src/controllers/contact.controller.js
- src/routes/contact.routes.js
- src/models/contact.model.js

## 数据模型关系

### 用户模型 (User)
- 关联到: Project, TempWork, Repair, Quote, Receipt, Salary, Attendance, Leave

### 项目模型 (Project)
- 关联到: User (客户), User (员工), Quote, Receipt

### 临时施工模型 (TempWork)
- 关联到: User (客户), User (审批人), User (施工人员)

### 维修申请模型 (Repair)
- 关联到: User (客户), User (维修人员)

### 报价模型 (Quote)
- 关联到: User (客户), Project

### 收据模型 (Receipt)
- 关联到: User (客户), Project, User (创建人)

### 工资模型 (Salary)
- 关联到: User (员工)

### 考勤模型 (Attendance)
- 关联到: User (员工)

### 请假模型 (Leave)
- 关联到: User (员工), User (审批人)

### 联系表单模型 (Contact)
- 无关联 