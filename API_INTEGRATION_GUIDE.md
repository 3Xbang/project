# 3XBANG建筑公司API集成指南

## 基本信息

- **API基础URL**: `http://localhost:5173/api`
- **版本**: 1.0.0
- **内容类型**: `application/json`

## 认证

所有API请求都使用JWT令牌进行认证。登录后获取令牌，并在后续请求中通过Authorization头部传递。

### 认证头部格式

```
Authorization: Bearer <your_jwt_token>
```

## 用户认证API

### 用户注册

- **URL**: `/auth/register`
- **方法**: `POST`
- **认证**: 不需要
- **请求体**:

```json
{
  "firstName": "用户名",
  "lastName": "用户姓",
  "email": "user@example.com",
  "password": "password123",
  "role": "client", // 可选值: "admin", "manager", "employee", "client"
  "company": "公司名称", // 仅客户角色需要
  "phone": "13800138000" // 可选
}
```

- **成功响应** (201 Created):

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "用户ID",
      "firstName": "用户名",
      "lastName": "用户姓",
      "email": "user@example.com",
      "role": "client",
      "company": "公司名称",
      "phone": "13800138000",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "JWT令牌"
  }
}
```

- **错误响应**:
  - 400 Bad Request: 输入验证失败
  - 409 Conflict: 邮箱已存在

### 用户登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **认证**: 不需要
- **请求体**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "用户ID",
      "firstName": "用户名",
      "lastName": "用户姓",
      "email": "user@example.com",
      "role": "client",
      "company": "公司名称",
      "phone": "13800138000",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "JWT令牌"
  }
}
```

- **错误响应**:
  - 400 Bad Request: 缺少必要字段
  - 401 Unauthorized: 凭据无效

### 检查会话状态

- **URL**: `/auth/check-session`
- **方法**: `GET`
- **认证**: 需要
- **成功响应** (200 OK):

```json
{
  "isAuthenticated": true,
  "user": {
    "_id": "用户ID",
    "firstName": "用户名",
    "lastName": "用户姓",
    "email": "user@example.com",
    "role": "client",
    "company": "公司名称",
    "phone": "13800138000",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

- **错误响应**:
  - 401 Unauthorized: 未提供令牌或令牌无效

### 用户登出

- **URL**: `/auth/logout`
- **方法**: `POST`
- **认证**: 需要
- **成功响应** (200 OK):

```json
{
  "success": true
}
```

## 测试账户

系统中已预置以下测试账户，可用于前端开发和测试：

### 管理员账户
- **邮箱**: `admin@3xbang.com`
- **密码**: `admin123`

### 客户账户
- **邮箱**: `client@example.com`
- **密码**: `client123`

### 员工账户
- **邮箱**: `employee@3xbang.com`
- **密码**: `employee123`

## 错误处理

所有API错误响应都遵循以下格式：

```json
{
  "success": false,
  "error": {
    "message": "错误描述",
    "code": "错误代码"
  }
}
```

常见错误代码：
- `INVALID_CREDENTIALS`: 凭据无效
- `VALIDATION_ERROR`: 输入验证失败
- `NOT_FOUND`: 资源未找到
- `UNAUTHORIZED`: 未授权访问
- `SERVER_ERROR`: 服务器内部错误 