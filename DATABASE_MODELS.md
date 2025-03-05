# 3XBANG建筑公司数据库模型关系

## 数据模型概览

本文档描述了3XBANG建筑公司后端API系统中的主要数据模型及其之间的关系。所有模型均使用MongoDB的Mongoose模式定义，支持关联查询和数据验证。

## 关系图

```
                                ┌───────────┐
                           ┌────┤   User    ├────┐
                           │    └───────────┘    │
                           │          │          │
                           ▼          ▼          ▼
          ┌───────────┐    ┌───────────┐    ┌───────────┐
     ┌────┤  Project  ├────┤  TempWork │    │  Repair   │
     │    └───────────┘    └───────────┘    └───────────┘
     │          │
     ▼          ▼
┌───────────┐   ┌───────────┐
│   Quote   ├───┤  Receipt  │
└───────────┘   └───────────┘

┌───────────┐   ┌───────────┐   ┌───────────┐
│  Salary   ├───┤ Attendance├───┤   Leave   │
└───────────┘   └───────────┘   └───────────┘
        │            │               │
        └────────────┼───────────────┘
                     ▼
               ┌───────────┐
               │   User    │
               └───────────┘

┌───────────┐
│  Contact  │
└───────────┘
```

## 主要数据模型

### 1. 用户模型 (User)

```javascript
{
  name: String,             // 用户名称
  email: String,            // 电子邮箱
  password: String,         // 密码(加密存储)
  role: String,             // 角色(admin, manager, employee, client)
  phone: String,            // 电话号码
  address: String,          // 地址
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 2. 项目模型 (Project)

```javascript
{
  title: String,            // 项目标题
  description: String,      // 项目描述
  client: ObjectId,         // 关联客户
  manager: ObjectId,        // 项目经理
  team: [ObjectId],         // 项目团队成员
  address: String,          // 项目地址
  startDate: Date,          // 开始日期
  endDate: Date,            // 预计结束日期
  actualEndDate: Date,      // 实际结束日期
  budget: Number,           // 预算
  status: String,           // 状态(planning, ongoing, completed, cancelled)
  progress: Number,         // 进度百分比
  documents: [{             // 相关文档
    title: String,
    url: String,
    uploadedAt: Date
  }],
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 3. 临时施工模型 (TempWork)

```javascript
{
  client: ObjectId,         // 关联客户
  workType: String,         // 施工类型
  location: String,         // 施工地点
  startDate: Date,          // 预计开始时间
  endDate: Date,            // 预计结束时间
  description: String,      // 施工描述
  status: String,           // 状态(待审核, 已批准, 已拒绝, 进行中, 已完成)
  approvedBy: ObjectId,     // 审批人
  approvalComments: String, // 审批意见
  workers: [ObjectId],      // 施工人员
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 4. 维修申请模型 (Repair)

```javascript
{
  client: ObjectId,         // 关联客户
  title: String,            // 标题
  description: String,      // 描述
  location: String,         // 地点
  photos: [String],         // 照片URL
  status: String,           // 状态(待处理, 已安排, 已完成, 已取消)
  priority: String,         // 优先级(低, 中, 高)
  assignedTo: ObjectId,     // 分配给谁
  reportedAt: Date,         // 报告时间
  scheduledAt: Date,        // 安排时间
  completedAt: Date,        // 完成时间
  notes: String,            // 备注
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 5. 报价模型 (Quote)

```javascript
{
  client: ObjectId,         // 关联客户
  project: ObjectId,        // 关联项目
  title: String,            // 标题
  description: String,      // 描述
  validUntil: Date,         // 有效期
  status: String,           // 状态(待确认, 已确认, 已拒绝, 已过期)
  items: [{                 // 报价项目
    name: String,           // 名称
    quantity: Number,       // 数量
    unit: String,           // 单位
    unitPrice: Number,      // 单价
    amount: Number          // 金额
  }],
  subtotal: Number,         // 小计
  tax: Number,              // 税额
  discount: Number,         // 折扣
  totalAmount: Number,      // 总金额
  notes: String,            // 备注
  confirmedAt: Date,        // 确认时间
  createdBy: ObjectId,      // 创建人
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 6. 收据模型 (Receipt)

```javascript
{
  receiptNumber: String,    // 收据编号
  client: ObjectId,         // 关联客户
  project: ObjectId,        // 关联项目
  amount: Number,           // 金额
  paymentMethod: String,    // 付款方式
  paymentDate: Date,        // 付款日期
  description: String,      // 描述
  items: [{                 // 收据项目
    name: String,           // 名称
    quantity: Number,       // 数量
    unitPrice: Number,      // 单价
    subtotal: Number        // 小计
  }],
  taxRate: Number,          // 税率
  taxAmount: Number,        // 税额
  totalAmount: Number,      // 总金额
  notes: String,            // 备注
  createdBy: ObjectId,      // 创建人
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 7. 工资模型 (Salary)

```javascript
{
  employee: ObjectId,       // 关联员工
  month: String,            // 工资月份
  year: Number,             // 工资年份
  basicSalary: Number,      // 基本工资
  overtime: Number,         // 加班费
  bonus: Number,            // 奖金
  deductions: Number,       // 扣款
  totalAmount: Number,      // 总金额
  paymentStatus: String,    // 支付状态
  paymentDate: Date,        // 支付日期
  notes: String,            // 备注
  createdBy: ObjectId,      // 创建人
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 8. 考勤模型 (Attendance)

```javascript
{
  employee: ObjectId,       // 关联员工
  month: Number,            // 考勤月份
  year: Number,             // 考勤年份
  totalDays: Number,        // 总工作日数
  presentDays: Number,      // 出勤天数
  absentDays: Number,       // 缺勤天数
  leaveDays: Number,        // 请假天数
  records: [{               // 每日记录
    date: Date,             // 日期
    status: String,         // 状态(出勤, 缺勤, 请假, 休息日)
    checkIn: Date,          // 签到时间
    checkOut: Date,         // 签退时间
    workHours: Number,      // 工作时长
    overtime: Number,       // 加班时长
    notes: String           // 备注
  }],
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 9. 请假模型 (Leave)

```javascript
{
  employee: ObjectId,       // 关联员工
  leaveType: String,        // 请假类型(事假, 病假, 年假, 婚假, 产假, 丧假)
  startDate: Date,          // 开始日期
  endDate: Date,            // 结束日期
  totalDays: Number,        // 总天数
  reason: String,           // 请假原因
  status: String,           // 状态(待审批, 已批准, 已拒绝)
  approvedBy: ObjectId,     // 审批人
  approvalComments: String, // 审批意见
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 10. 联系表单模型 (Contact)

```javascript
{
  name: String,             // 姓名
  email: String,            // 电子邮箱
  phone: String,            // 电话
  message: String,          // 消息内容
  projectType: String,      // 项目类型
  status: String,           // 处理状态
  handledBy: ObjectId,      // 处理人
  handledAt: Date,          // 处理时间
  notes: String,            // 备注
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

## 模型间关系说明

1. **用户(User)** 与多个模型有关联:
   - 一个用户可以关联多个项目(作为客户或员工)
   - 一个用户可以提交多个临时施工申请(作为客户)
   - 一个用户可以提交多个维修申请(作为客户)
   - 一个用户可以有多个报价和收据(作为客户)
   - 一个用户可以有多个工资记录、考勤记录和请假申请(作为员工)

2. **项目(Project)** 与其他模型的关系:
   - 一个项目关联一个客户(User)
   - 一个项目可以有多个团队成员(User)
   - 一个项目可以有多个报价(Quote)
   - 一个项目可以有多个收据(Receipt)

3. **临时施工(TempWork)** 关系:
   - 一个临时施工申请关联一个客户(User)
   - 一个临时施工可以分配给多个施工人员(User)

4. **维修申请(Repair)** 关系:
   - 一个维修申请关联一个客户(User)
   - 一个维修申请可以分配给一个维修人员(User)

5. **报价(Quote)和收据(Receipt)** 关系:
   - 报价和收据都关联一个客户(User)
   - 报价和收据可以关联一个项目(Project)

6. **员工相关模型** 关系:
   - 工资(Salary)、考勤(Attendance)和请假(Leave)模型都关联一个员工(User)

7. **联系表单(Contact)** 无直接关联，但处理人可以是一个用户(User) 