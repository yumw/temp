import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'

// loading实例
let loadingInstance
// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  baseURL: '/api',
  timeout: 15000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    loadingInstance = Loading.service({
      lock: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    // if (store.getters.token) {
    //   config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    //config.headers['ip'] = window.location.host;
    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    loadingInstance.close()
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    loadingInstance.close()
    // if (response.headers['content-type'] && response.headers['content-type'].indexOf('text/html') >= 0) {
    //   const url = window.location.href
    //   const loginPath = `${window.location.origin}/me?redirect_uri=${url}`
    //   window.location.replace(loginPath)
    //   return
    // }
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.resCode !== '0000') {
      //console.log(res.resCode)
      if (res.resCode === '0004') {
        console.log(res.resData.redirectUrl)
        window.location.replace(res.resData.redirectUrl)
      } else {
        Message({
          message: res.resMsg,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject('error')
      }
      
    } else {
      return response.data
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    loadingInstance.close()
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
