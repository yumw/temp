import store from '@/store'
//合作模式
let cooperativeMode = (value) => {
  let cooperativeMode = store.state.globalData.cooperativeMode;
  let result = cooperativeMode.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}
//渠道名
let channelName = (value) => {
  let channelName = store.state.globalData.channel;
  let result = channelName.filter( item => item.channelCode == value)
  return result.length ? result[0].channelName : ''
}
//用信状态
let approvalStatus = (value) => {
  let approvalStatus = store.state.globalData.approvalStatus;
  let result = approvalStatus.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}
//放款状态
let loanStatus = (value) => {
  let loanStatus = store.state.globalData.loanStatus;
  let result = loanStatus.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}
//处理状态
let processState = (value) => {
  let processState = store.state.globalData.processState;
  let result = processState.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}
//异常状态
let exceptionState = (value) => {
  let exceptionState = store.state.globalData.exceptionState;
  let result = exceptionState.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}
//文件类型
let fileType = (value) => {
  let fileType = store.state.globalData.fileType;
  let result = fileType.filter( item => item.name == value)
  return result.length ? result[0].value : ''
}
//文件状态
let fileOperateState = (value) => {
  let fileOperateState = store.state.globalData.fileOperateState;
  let result = fileOperateState.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}

export {
  cooperativeMode,
  channelName,
  approvalStatus,
  loanStatus,
  processState,
  exceptionState,
  fileType,
  fileOperateState
}