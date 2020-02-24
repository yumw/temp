// 进件申请列表页 贷款审批状态
export const loanStatusList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '无',
    value: ' '
  },
  {
    label: '审批中',
    value: '1001'
  },
  {
    label: '通过',
    value: '0000'
  },
  {
    label: '拒绝',
    value: '0001'
  },
  {
    label: '超时取消',
    value: '0002'
  },
  {
    label: '通过（部分放款）',
    value: '0003'
  },
  {
    label: '放弃申請',
    value: '0004'
  },
  {
    label: '退回补件',
    value: '0006'
  },
  {
    label: '资质预审通过',
    value: '0007'
  },
  {
    label: '资质预审超过指定时间未面签',
    value: '0008'
  },
  {
    label: '面签提交审核中',
    value: '0009'
  },
  {
    label: '资质预审拒绝',
    value: '0010'
  },
  {
    label: '关户',
    value: '0011'
  },
  {
    label: '资质预审产品退回补件',
    value: '0012'
  },
  {
    label: '存量预授信激活成功',
    value: '0013'
  },
  {
    label: '客户激活成功',
    value: '0014'
  },
  {
    label: '缺少审批文件拒绝',
    value: '0015'
  },
  {
    label: '异常',
    value: '9999'
  }
]
// 循环提现列表页 提现状态
export const advanceStatusList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '审批中',
    value: '1001'
  },
  {
    label: '成功',
    value: '0000'
  },
  {
    label: '异常',
    value: '9999'
  },
  {
    label: '失败',
    value: '9000'
  },
  {
    label: '人脸比对不通过',
    value: '0002'
  }
]
// 文件管理=》下载管理页 文件类型
export const fileTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '放款明细文件',
    value: 'ADVANCE'
  },
  {
    label: '还款明细文件',
    value: 'REFUND'
  },
  {
    label: '汇总对账文件',
    value: 'SUMMARY'
  }
]
// 文件管理=》文件下载状态页 文件类型
export const fileTypeList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '总账',
    value: '01'
  },
  {
    label: '明细',
    value: '02'
  },
  {
    label: '放款对账',
    value: '03'
  },
  {
    label: '还款对账',
    value: '04'
  },
  {
    label: '协议文件',
    value: '88'
  },
  {
    label: '身份证影像',
    value: '55'
  },
  {
    label: '批扣文件',
    value: '85'
  },
  {
    label: '合同文件',
    value: '89'
  },
  {
    label: '贷后凭证',
    value: '90'
  },
  {
    label: '贷款合同',
    value: '91'
  },
  {
    label: '贷款确认书',
    value: '93'
  },
  {
    label: '征信文件',
    value: '94'
  }
]
// 文件管理=》文件下载状态页 状态
export const statusList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '取消发送',
    value: '-1'
  },
  {
    label: '未发送',
    value: '0'
  },
  {
    label: '成功',
    value: '1'
  },
  {
    label: '重试',
    value: '2'
  }
]
// 进件申请列表列表页 进件状态
export const applyStatusList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '进件失败',
    value: 0
  },
  {
    label: '进件成功',
    value: 1
  },
  {
    label: '前置拒绝',
    value: 2
  },
  {
    label: '待拉取附件',
    value: 10
  },
  {
    label: '待进件',
    value: 11
  }
]

export const repayTypeList = [
  {
    label: '正常还款',
    value: 'N'
  },
  {
    label: '提前还款',
    value: 'P'
  },
  {
    label: '关户结清',
    value: 'C'
  }
]

export const tradeStatusList = [
  {
    label: '订单创建',
    value: '01'
  },
  {
    label: '订单关闭',
    value: '02'
  },
  {
    label: '订单处理失败',
    value: '04'
  },
  {
    label: '完成',
    value: '05'
  },
  {
    label: '待定异步通知',
    value: '07'
  }
]

/*
getChannelInfo  渠道名称
getChannelStatus 渠道状态
getEncryptMethods 加密方式
getChannelMerchantCodes 商户编码
getControlTypeList
exceptionProcessStates 异常管理页处理状态
*/
