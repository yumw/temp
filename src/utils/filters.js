import store from '@/store'
//合作模式
let cooperativeMode = (value) => {
  let cooperativeMode = store.state.globalData.cooperativeMode;
  let result = cooperativeMode.filter( item => item.value == value)
  return result.length ? result[0].label : ''
}

export {
  cooperativeMode
}