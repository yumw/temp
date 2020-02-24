import router, { asyncRouterMap, routerMap } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getMenu, findPrivilege } from '@/api/login'
import { filterMenu } from '@/store/modules/permission'
import { deepCopy } from '@/utils'
import Layout from './views/layout/Layout'

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const _menu = deepCopy(asyncRouterMap)
  const res = await getMenu();
  console.log(res.resData)
  //res.resData.redirectUrl
  //"http://11.112.0.14:8000/oauth/authorize?client_id=A29&redirect_uri=http://10.192.172.86:8080/bg/sso/home&response_type=code&state=d1511122-278c-4bf0-b1a8-baa5d4ff8d99"

  //const permissionList = res.data
  //store.commit('SET_BTNS',['c','bc'])

  //let permissionList = []
  //permissionList.push('customerList','assetPackConf','partnerMgmt','ruleConf','channelMgmt','productIdMgmt','urgeRepayConf','reportCreditConf','permissionsmgmt')
  //filterMenu(menu, permissionList)
  let menuObj = routerMap;
  let menu = [];
  let idObj = {}
  res.resData.forEach(item => {
    let children = [];
    if( item.children && item.children.length>0){
      item.children.forEach(item2 => {
        if(item2.urlFlag && menuObj[item2.urlFlag]){
          idObj[item2.urlFlag] = item2.id;
          console.log(item2.urlFlag,item2.id)
          let data = menuObj[item2.urlFlag]
          if(Array.isArray(data)){
            data.forEach(arr =>{
              arr.meta.id = item2.id;
            })
            children = children.concat(data)
          }else{
            data.meta.id = item2.id;
            children.push(data)
          }
        }
      })
      
    }else{
      if(item.urlFlag && menuObj[item.urlFlag]){
        idObj[item.urlFlag] = item.id;
        menuObj[item.urlFlag].id = item.id
        children.push(menuObj[item.urlFlag])
      }
    }
    menu.push({
      path:'',
      component: Layout,
      redirect: '',
      name: item.text,
      meta: { title: item.text, icon: '',id:item.id },
      children
    })
  })

  console.log(menu)
  console.log(from,to)
  let flag = idObj[to.path.substring(1)];
  if( !flag){
    store.dispatch('GenerateRoutes', { permissionList: menu }).then(() => {
      next()
    })
    return false;
  }
  const res2 = await findPrivilege({menuId:flag});
  let btnArr = res2.resData.map(item => item.privilegeFlag)
  store.commit('SET_BTNS',btnArr)
  store.dispatch('GenerateRoutes', { permissionList: menu }).then(() => {
    next()
  })
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
