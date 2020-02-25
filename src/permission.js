import router, {getRoute } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getMenu, findPrivilege } from '@/api/login'
import { filterMenu } from '@/store/modules/permission'
import { deepCopy } from '@/utils'
//import Layout from './views/layout/Layout'

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if(!store.getters.permission_routers || store.getters.permission_routers.length === 0){
    getMenu().then(res => {
      let arr = deepCopy(res.resData)
      let _menu = getRoute(arr)
      store.dispatch('GenerateRoutes', { permissionList: _menu }).then(() => {
        router.addRoutes(store.getters.permission_routers)
        if(to.path === '/404'){
          next({path: to.redirectedFrom});
        }else{
          let flag = to.meta.id;
          if(flag){
            findPrivilege({menuId:flag}).then(res => {
              let btnArr = res.resData.map(item => item.privilegeFlag)
              store.commit('SET_BTNS',btnArr)
              next();
            })
          }else{
            next();
          } 
        }
        
      })
    })
  }else{
    let flag = to.meta.id;
    if(flag){
      findPrivilege({menuId:flag}).then(res => {
        let btnArr = res.resData.map(item => item.privilegeFlag)
        store.commit('SET_BTNS',btnArr)
        next();
      })
    }else{
      next();
    } 
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
