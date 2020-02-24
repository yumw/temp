import router, { asyncRouterMap } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getMenu } from '@/api/login'
import { filterMenu } from '@/store/modules/permission'
import { deepCopy } from '@/utils'

router.beforeEach(async(to, from, next) => {
  NProgress.start()
console.log(123123)
  const menu = deepCopy(asyncRouterMap)
  //const res = await getMenu();
  //console.log(res)
  //res.resData.redirectUrl
  //"http://11.112.0.14:8000/oauth/authorize?client_id=A29&redirect_uri=http://10.192.172.86:8080/bg/sso/home&response_type=code&state=d1511122-278c-4bf0-b1a8-baa5d4ff8d99"

  //const permissionList = res.data
  let permissionList = []
  permissionList.push('customerList','assetPackConf','partnerMgmt','ruleConf','channelMgmt','productIdMgmt','urgeRepayConf','reportCreditConf','permissionsmgmt')
  filterMenu(menu, permissionList)
  store.dispatch('GenerateRoutes', { permissionList: menu }).then(() => {
    next()
  })
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
