/**
 * 考勤数据模型
 * 
 * 定义员工考勤的数据结构，包括:
 * - 员工ID
 * - 考勤月份
 * - 考勤统计
 * - 每日考勤记录
 */

const mongoose = require('mongoose');

// 定义日工作记录模式
const dailyWorkRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, '必须提供日期']
  },
  weekday: {
    type: String,
    enum: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  clockIn: {
    type: String,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, '打卡时间格式必须为HH:MM']
  },
  clockOut: {
    type: String,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, '打卡时间格式必须为HH:MM']
  },
  workHours: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['normal', 'late', 'early', 'absent', 'overtime', 'leave'],
    default: 'normal'
  },
  note: {
    type: String,
    maxlength: [200, '备注不能超过200个字符']
  }
});

// 定义考勤模式
const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须关联员工账户']
  },
  month: {
    type: String,
    required: [true, '必须提供考勤月份'],
    match: [/^\d{6}$/, '月份格式必须为YYYYMM'] // 如202310
  },
  stats: {
    normalDays: {
      type: Number,
      default: 0
    },
    lateDays: {
      type: Number,
      default: 0
    },
    earlyDays: {
      type: Number,
      default: 0
    },
    absentDays: {
      type: Number,
      default: 0
    },
    overtimeDays: {
      type: Number,
      default: 0
    },
    leaveDays: {
      type: Number,
      default: 0
    },
    totalWorkHours: {
      type: Number,
      default: 0
    },
    totalOvertimeHours: {
      type: Number,
      default: 0
    }
  },
  records: [dailyWorkRecordSchema],
  calendarDays: [{
    date: Date,
    dayType: {
      type: String,
      enum: ['workday', 'weekend', 'holiday'],
      default: 'workday'
    },
    status: {
      type: String,
      enum: ['normal', 'late', 'early', 'absent', 'overtime', 'leave', 'none'],
      default: 'none'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 在更新时自动设置updatedAt字段
attendanceSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// 添加日考勤记录时，自动更新统计数据
attendanceSchema.methods.addRecord = function(record) {
  // 添加记录
  this.records.push(record);
  
  // 更新统计
  switch (record.status) {
    case 'normal':
      this.stats.normalDays += 1;
      break;
    case 'late':
      this.stats.lateDays += 1;
      break;
    case 'early':
      this.stats.earlyDays += 1;
      break;
    case 'absent':
      this.stats.absentDays += 1;
      break;
    case 'overtime':
      this.stats.overtimeDays += 1;
      break;
    case 'leave':
      this.stats.leaveDays += 1;
      break;
  }
  
  // 更新工时统计
  this.stats.totalWorkHours += record.workHours || 0;
  this.stats.totalOvertimeHours += record.overtime || 0;
  
  // 更新日历数据
  const calendarDay = this.calendarDays.find(day => 
    day.date.toISOString().split('T')[0] === record.date.toISOString().split('T')[0]
  );
  
  if (calendarDay) {
    calendarDay.status = record.status;
  }

  return this;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance; 