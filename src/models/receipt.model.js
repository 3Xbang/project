/**
 * 收据模型
 * 
 * 用于记录客户的付款收据，包括金额、日期、项目等信息
 */

const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  // 收据编号
  receiptNumber: {
    type: String,
    required: [true, '必须有收据编号'],
    unique: true,
    trim: true
  },
  
  // 关联的客户
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须指定客户']
  },
  
  // 关联的项目(可选)
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  
  // 收据金额
  amount: {
    type: Number,
    required: [true, '必须指定金额']
  },
  
  // 付款方式
  paymentMethod: {
    type: String,
    required: [true, '必须指定付款方式'],
    enum: ['现金', '银行转账', '支付宝', '微信支付', '其他']
  },
  
  // 付款日期
  paymentDate: {
    type: Date,
    required: [true, '必须指定付款日期'],
    default: Date.now
  },
  
  // 收据描述
  description: {
    type: String,
    required: [true, '必须提供收据描述']
  },
  
  // 收据项目明细
  items: [{
    name: {
      type: String,
      required: [true, '必须指定项目名称']
    },
    quantity: {
      type: Number,
      required: [true, '必须指定数量'],
      min: [1, '数量必须大于0']
    },
    unitPrice: {
      type: Number,
      required: [true, '必须指定单价']
    },
    subtotal: {
      type: Number,
      required: [true, '必须指定小计']
    }
  }],
  
  // 税率
  taxRate: {
    type: Number,
    default: 0
  },
  
  // 税额
  taxAmount: {
    type: Number,
    default: 0
  },
  
  // 总计(含税)
  totalAmount: {
    type: Number,
    required: [true, '必须指定总金额']
  },
  
  // 备注
  notes: {
    type: String
  },
  
  // 创建人(管理员)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '必须指定创建人']
  },
  
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 创建索引以提高查询性能
ReceiptSchema.index({ client: 1, paymentDate: -1 });
ReceiptSchema.index({ receiptNumber: 1 }, { unique: true });

// 自动计算总金额
ReceiptSchema.pre('validate', function(next) {
  if (this.items && this.items.length > 0) {
    // 计算小计
    this.items.forEach(item => {
      item.subtotal = item.quantity * item.unitPrice;
    });
    
    // 计算总金额(不含税)
    const subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // 计算税额
    this.taxAmount = subtotal * (this.taxRate / 100);
    
    // 计算总金额(含税)
    this.totalAmount = subtotal + this.taxAmount;
  }
  next();
});

// 更新时自动更新updatedAt字段
ReceiptSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Receipt', ReceiptSchema); 