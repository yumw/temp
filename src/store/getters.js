const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  permission_routers: (state) => state.permission.routers,
  addRouters: (state) => state.permission.addRouters,
  getincomingChannels: (state) => [{ key: '', value: '全部' }, ...state.globalData.incomingChannels],
  getassetPackNo: (state) => [{ key: '', value: '全部' }, ...state.globalData.assetPackNo],
}
export default getters
