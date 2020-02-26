import { getChannelInfo } from '@/api/channelmgmt'
import { findAllChannel, findAllProduct, findAllLabel,findAllPartner } from '@/api/common'
const globalData = {
  state: {
    channel: [], //进件渠道
    assetPackNo: [], //资产包编号
    assetTag: [], //资产标签
    product: [], //产品号
    cooperativeMode: [], //合作模式
    partner:[], //资方列表
  },
  mutations: {
    SET_VALUES: (state, values) => {
      state = Object.assign(state, values)
    }
  },
  actions: {
    SetValues({ commit }, values) {
      commit('SET_VALUES', values)
    },
    getChannel({commit}){
      findAllChannel().then(res => {
        const channel = res.resData.list;
        commit('SET_VALUES', { channel })
      }).catch(error => {
        console.log(error)
      })
    },
    getAssetPackNo({commit}){
      let assetPackNo = [
        {key:'R0001',value:'R0001'},
        {key:'R0002',value:'R0002'},
        {key:'R0003',value:'R0003'}
      ]
      commit('SET_VALUES', { assetPackNo })
    },
    getAssetTag({commit}){
      findAllLabel().then(res => {
        const _assetTag = res.resData
        let assetTag = [];
        for(let i in _assetTag){assetTag.push({caseLabel:_assetTag[i]})}
        commit('SET_VALUES', { assetTag })
      }).catch(error => {
        console.log(error)
      })
    },
    getProduct({commit}){
      findAllProduct().then(res => {
        const product = res.resData.list;
        commit('SET_VALUES', { product })
      }).catch(error => {
        console.log(error)
      })
    },
    getPartner({commit}){
      findAllPartner().then(res => {
        const partner = res.resData.list;
        commit('SET_VALUES', { partner })
      }).catch(error => {
        console.log(error)
      })
    },
    getCooperativeMode({commit}){
      let cooperativeMode = [
        {value:'0',label:'中邮自营'},
        {value:'1',label:'联合贷款'},
        {value:'2',label:'资方全资'}
      ]
      commit('SET_VALUES', { cooperativeMode })
    }
  }
}
export default globalData
