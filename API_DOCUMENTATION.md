# 3XBANG建筑公司 API 文档

## 概述

本文档列出了3XBANG建筑公司后端API系统的所有可用端点。API使用RESTful风格设计，返回JSON格式数据。

基础URL: `http://localhost:3001/api`

## 认证

大多数API端点需要认证。请在请求头中包含Bearer令牌：

```
Authorization: Bearer <your_token>
```

通过`/api/auth/login`端点获取令牌。

## 目录

1. [认证](#认证API)
2. [用户管理](#用户管理)
3. [项目管理](#项目管理)
4. [临时施工申请](#临时施工申请)
5. [维修申请](#维修申请)
6. [报价管理](#报价管理)
7. [收据管理](#收据管理)
8. [工资管理](#工资管理)
9. [考勤管理](#考勤管理)
10. [请假申请](#请假申请)
11. [联系表单](#联系表单)

## 认证API

### 注册用户

```
POST /auth/register
```

**请求体**:
```json
{
  "name": "用户名称",
  "email": "user@example.com",
  "password": "password123",
  "role": "client" // 可选，默认为client
}
```

### 用户登录

```
POST /auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5f8d0c55b54764421b7156d1",
    "name": "用户名称",
    "email": "user@example.com",
    "role": "client"
  }
}
```

### 获取当前用户信息

```
GET /auth/me
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "5f8d0c55b54764421b7156d1",
    "name": "用户名称",
    "email": "user@example.com",
    "role": "client"
  }
}
```

## 用户管理

### 获取用户列表（管理员）

```
GET /users
```

### 获取单个用户

```
GET /users/:id
```

### 更新用户

```
PUT /users/:id
```

### 删除用户（管理员）

```
DELETE /users/:id
```

## 项目管理

### 获取项目列表

```
GET /projects
```

### 获取单个项目

```
GET /projects/:id
```

### 创建项目（管理员）

```
POST /projects
```

### 更新项目（管理员）

```
PUT /projects/:id
```

### 删除项目（管理员）

```
DELETE /projects/:id
```

## 临时施工申请

### 获取临时施工列表（客户）

```
GET /client/temp-works
```

**响应**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "5f8d0c55b54764421b7156d1",
      "workType": "水电维修",
      "location": "北京市朝阳区",
      "startDate": "2023-10-15T00:00:00.000Z",
      "endDate": "2023-10-16T00:00:00.000Z",
      "description": "水管漏水需要修复",
      "status": "待审核",
      "createdAt": "2023-10-01T00:00:00.000Z"
    }
  ]
}
```

### 获取单个临时施工

```
GET /client/temp-works/:id
```

### 创建临时施工申请（客户）

```
POST /client/temp-works
```

**请求体**:
```json
{
  "workType": "水电维修",
  "location": "北京市朝阳区",
  "startDate": "2023-10-15",
  "endDate": "2023-10-16",
  "description": "水管漏水需要修复"
}
```

### 更新临时施工状态（管理员）

```
PUT /client/temp-works/:id
```

**请求体**:
```json
{
  "status": "已批准",
  "approvalComments": "已安排施工人员",
  "workers": ["5f8d0c55b54764421b7156d2", "5f8d0c55b54764421b7156d3"]
}
```

### 删除临时施工（管理员）

```
DELETE /client/temp-works/:id
```

## 维修申请

### 获取维修申请列表（客户）

```
GET /client/repairs
```

### 获取维修申请统计

```
GET /client/repairs/stats
```

### 获取单个维修申请

```
GET /client/repairs/:id
```

### 创建维修申请（客户）

```
POST /client/repairs
```

**请求体**:
```json
{
  "title": "水管漏水",
  "description": "厨房水管漏水，需要紧急维修",
  "location": "北京市朝阳区",
  "preferredDateTime": "2023-10-15T14:00:00Z",
  "contactPhone": "13812345678"
}
```

### 更新维修申请状态（管理员）

```
PUT /client/repairs/:id
```

**请求体**:
```json
{
  "status": "已安排",
  "assignedTo": "5f8d0c55b54764421b7156d2",
  "scheduledDateTime": "2023-10-15T14:00:00Z",
  "adminNotes": "已安排技术人员前往"
}
```

### 删除维修申请（管理员）

```
DELETE /client/repairs/:id
```

## 报价管理

### 获取报价列表（客户）

```
GET /client/quotes
```

### 获取单个报价

```
GET /client/quotes/:id
```

### 创建报价（管理员）

```
POST /client/quotes
```

**请求体**:
```json
{
  "client": "5f8d0c55b54764421b7156d1",
  "project": "5f8d0c55b54764421b7156e1",
  "title": "厨房装修报价",
  "description": "包含墙面、地面、水电改造等",
  "validUntil": "2023-11-15",
  "items": [
    {
      "name": "墙面刷漆",
      "quantity": 30,
      "unit": "平方米",
      "unitPrice": 50,
      "amount": 1500
    },
    {
      "name": "水电改造",
      "quantity": 1,
      "unit": "项",
      "unitPrice": 2000,
      "amount": 2000
    }
  ],
  "subtotal": 3500,
  "tax": 350,
  "totalAmount": 3850
}
```

### 确认报价（客户）

```
PUT /client/quotes/:id/confirm
```

### 更新报价（管理员）

```
PUT /client/quotes/:id
```

### 删除报价（管理员）

```
DELETE /client/quotes/:id
```

## 收据管理

### 获取收据列表（客户）

```
GET /client/receipts
```

### 获取单个收据

```
GET /client/receipts/:id
```

### 创建收据（管理员）

```
POST /client/receipts
```

**请求体**:
```json
{
  "client": "5f8d0c55b54764421b7156d1",
  "project": "5f8d0c55b54764421b7156e1",
  "amount": 3850,
  "paymentMethod": "银行转账",
  "paymentDate": "2023-10-10",
  "description": "厨房装修项目首付款",
  "items": [
    {
      "name": "墙面刷漆",
      "quantity": 30,
      "unitPrice": 50,
      "subtotal": 1500
    },
    {
      "name": "水电改造",
      "quantity": 1,
      "unitPrice": 2000,
      "subtotal": 2000
    }
  ],
  "taxRate": 10,
  "notes": "客户已通过银行转账支付"
}
```

### 更新收据（管理员）

```
PUT /client/receipts/:id
```

### 删除收据（管理员）

```
DELETE /client/receipts/:id
```

## 工资管理

### 获取工资列表（员工）

```
GET /salary
```

### 获取单个工资记录（员工）

```
GET /salary/:id
```

### 创建工资记录（管理员）

```
POST /salary
```

### 更新工资记录（管理员）

```
PUT /salary/:id
```

### 删除工资记录（管理员）

```
DELETE /salary/:id
```

## 考勤管理

### 获取考勤记录（员工）

```
GET /attendance
```

### 获取单个考勤记录（员工）

```
GET /attendance/:id
```

### 打卡（员工）

```
POST /attendance/clock
```

### 更新考勤记录（管理员）

```
PUT /attendance/:id
```

## 请假申请

### 获取请假申请列表（员工）

```
GET /leave
```

### 获取单个请假申请（员工）

```
GET /leave/:id
```

### 创建请假申请（员工）

```
POST /leave
```

### 审批请假申请（管理员）

```
PUT /leave/:id
```

### 删除请假申请（管理员）

```
DELETE /leave/:id
```

## 联系表单

### 提交联系表单（公开）

```
POST /contact
```

**请求体**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "message": "我想了解一下贵公司的装修服务",
  "projectType": "住宅装修"
}
```

### 获取联系表单列表（管理员）

```
GET /contact
```

### 获取单个联系表单（管理员）

```
GET /contact/:id
```

### 更新联系表单状态（管理员）

```
PUT /contact/:id
```

### 删除联系表单（管理员）

```
DELETE /contact/:id
``` 