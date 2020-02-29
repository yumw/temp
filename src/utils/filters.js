import store from '@/store'
//合作模式
let cooperativeMode = (value) => {
  let cooperativeMode = store.state.globalData.cooperativeMode;
  let result = cooperativeMode.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}

let channelName = (value) => {
  let channelName = store.state.globalData.channel;
  let result = channelName.filter( item => item.channelCode == value)
  return result.length ? result[0].channelName : ''
}

export {
  cooperativeMode,
  channelName
}