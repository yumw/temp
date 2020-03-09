import { findAllChannel, findAllProduct, findAllLabel,findAllPartner, findAllService, findAllFileType } from '@/api/common'
import { getEnumByType } from '@/api/configEnum'
import { resolve } from 'url';
const approvalStatus = [
  {value: '120000', label: '用信中'},
  {value: '120001', label: '用信成功'}, 
  {value: '120002', label: '用信失败可重新发起提现'}, 
  {value: '120003', label: '用信失败不可重新发起提现'}
]
const loanStatus = [
  {value: '130001', label: '放款成功'}, 
  {value: '130002', label: '放款失败'}, 
  {value: '130000', label: '提现流水号与全局流水号匹配异常'}
]
const processState = [
  {value: '0', label: '未请求'},
  {value: '1', label: '请求成功'},
  {value: '2', label: '请求失败'},
  {value: '3', label: '重试异常'},
  {value: '5', label: '请求放弃'}
]
const exceptionState = [
  {value: '0', label: '未处理'},
  {value: '1', label: '重试成功'},
  {value: '2', label: '已忽略'},
  {value: '4', label: '重试中'},
  {value: '5', label: '重试失败'},
  {value: '-1', label: '未知'}
]

//文件状态
const fileOperateState = [
  {value: 0, label: '未处理'},
  {value: 1, label: '已处理'},
  {value: 2, label: '已归档'},
  {value: 3, label: '处理失败'}
]

const globalData = {
  state: {
    channel: [], //进件渠道
    assetPackNo: [], //资产包编号
    assetTag: [], //资产标签
    product: [], //产品号
    cooperativeMode: [], //合作模式
    partner: [], //资方列表
    serviceName: [], //服务名
    approvalStatus,
    loanStatus,
    processState,
    exceptionState,
    fileType: [], //文件类型
    fileOperateState
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
      return new Promise((resolve,reject) => {
        findAllPartner().then(res => {
          const partner = res.resData.list;
          commit('SET_VALUES', { partner })
          resolve();
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    getServiceName({commit}){
      getEnumByType('serviceName').then(res => {
        const serviceName = res.resData;
        commit('SET_VALUES', { serviceName })
      }).catch(error => {
        console.log(error)
      })
    },
    getFileType({commit}){
      return new Promise((resolve,reject) => {
        getEnumByType('fileType').then(res => {
          const fileType = res.resData;
          commit('SET_VALUES', { fileType })
          resolve();
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    getCooperativeMode({commit}){
      let cooperativeMode = [
        {value:'0',label:'中邮自营'},
        {value:'1',label:'联合贷款'},
        {value:'2',label:'资方全资'}
      ]
      commit('SET_VALUES', { cooperativeMode })
    },
    
  }
}
export default globalData
