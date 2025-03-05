# API通信响应

## 日期：2025-03-05

## 回复前端团队问题

### 1. 测试账户问题

前端团队反馈的"测试账户可能未激活或配置"问题已解决。我们已确认以下测试账户可用：

#### 管理员账户
- **邮箱**: `admin@3xbang.com`
- **密码**: `admin123`

#### 客户账户
- **邮箱**: `client@example.com`
- **密码**: `client123`

#### 员工账户
- **邮箱**: `employee@3xbang.com`
- **密码**: `employee123`

**重要说明**：登录时必须使用完整的电子邮箱地址，不能只使用用户名部分。

### 2. API路径确认

前端团队提出的API路径问题已确认：

- **API基础URL**: `http://localhost:5173/api`
- **登录路径**: `/auth/login`
- **注册路径**: `/auth/register`
- **会话检查路径**: `/auth/check-session`
- **登出路径**: `/auth/logout`

所有路径均已测试并确认可用。

### 3. API文档

我们已创建完整的API集成指南，文件位于项目根目录的`API_INTEGRATION_GUIDE.md`。该文档包含：

- API基本信息
- 认证方式
- 所有API端点详细说明
- 请求和响应格式
- 错误处理
- 测试账户信息

### 4. 登录API详细说明

#### 登录API

- **URL**: `/api/auth/login`
- **方法**: `POST`
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

- **错误响应** (401 Unauthorized):

```json
{
  "success": false,
  "error": {
    "message": "电子邮箱或密码不正确",
    "code": "INVALID_CREDENTIALS"
  }
}
```

### 5. 服务器状态

服务器当前正在运行，端口为5173。所有API端点均已测试并确认可用。

### 6. 下一步建议

1. 使用提供的测试账户进行登录测试
2. 参考API集成指南实现其他API调用
3. 如遇到任何问题，请及时反馈

## 联系人

如有任何问题，请联系后端开发团队。 