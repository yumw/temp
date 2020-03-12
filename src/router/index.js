import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantMenu = [
  {
    path: '',
    name: 'Dashboard',
    hasOneShowingChildren: true,
    children: [
      {
        path: 'dashboard',
        name: '首页',
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]
export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: { title: '首页', icon: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

/* export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '',
    name: '查询',
    meta: { title: '查询', icon: 'download' },
    children: [
      {
        id: 'customerList',
        path: 'customerList',
        name: '客户查询',
        component: () => import('@/views/customer/list'),
        meta: { title: '客户查询', icon: 'download' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: '',
    name: '分发管理',
    meta: { title: '分发管理', icon: 'download' },
    children: [
      {
        id: 'assetPackConf',
        path: 'assetPackConf',
        name: 'assetPackConf',
        component: () => import('@/views/assetPackConf/list'),
        meta: { title: '资产包配置', icon: 'download' }
      },
      {
        id: 'assetPackConf',
        path: 'assetPackConf/add',
        name: 'assetPackConfAdd',
        hidden: true,
        component: () => import('@/views/assetPackConf/edit'),
        meta: { title: '资产包配置新增', icon: 'download' }
      },
      {
        id: 'assetPackConf',
        path: 'assetPackConf/edit',
        name: 'assetPackConfEdit',
        hidden: true,
        component: () => import('@/views/assetPackConf/edit'),
        meta: { title: '资产包配置修改', icon: 'download' }
      },
      {
        id: 'partnerMgmt',
        path: 'partnerMgmt',
        name: 'partnerMgmt',
        component: () => import('@/views/partnerMgmt/list'),
        meta: { title: '资方管理', icon: 'download' }
      },
      {
        id: 'partnerMgmt',
        path: 'partnerMgmt/add',
        name: 'partnerMgmtAdd',
        hidden: true,
        component: () => import('@/views/partnerMgmt/edit'),
        meta: { title: '资方管理新增', icon: 'download' }
      },
      {
        id: 'partnerMgmt',
        path: 'partnerMgmt/edit',
        name: 'partnerMgmtEdit',
        hidden: true,
        component: () => import('@/views/partnerMgmt/edit'),
        meta: { title: '资方管理修改', icon: 'download' }
      },
      {
        id: 'ruleConf',
        path: 'ruleConf',
        name: 'ruleConf',
        component: () => import('@/views/ruleConf/list'),
        meta: { title: '分发配置', icon: 'download' }
      },
      {
        id: 'ruleConf',
        path: 'ruleConf/add',
        name: 'ruleConfAdd',
        hidden: true,
        component: () => import('@/views/ruleConf/edit'),
        meta: { title: '分发配置新增', icon: 'download' }
      },
      {
        id: 'ruleConf',
        path: 'ruleConf/edit',
        name: 'ruleConfEdit',
        hidden: true,
        component: () => import('@/views/ruleConf/edit'),
        meta: { title: '分发配置修改', icon: 'download' }
      },
      {
        id: 'channelMgmt',
        path: 'channelMgmt',
        name: 'channelMgmt',
        component: () => import('@/views/channelMgmt/list'),
        meta: { title: '渠道管理', icon: 'download' }
      },
      {
        id: 'productIdMgmt',
        path: 'productIdMgmt',
        name: 'productIdMgmt',
        component: () => import('@/views/productIdMgmt/list'),
        meta: { title: '产品号管理', icon: 'download' }
      },
      {
        id: 'urgeRepayConf',
        path: 'urgeRepayConf',
        name: 'urgeRepayConf',
        component: () => import('@/views/urgeRepayConf/list'),
        meta: { title: '催收配置', icon: 'download' }
      },
      {
        id: 'reportCreditConf',
        path: 'reportCreditConf',
        name: 'reportCreditConf',
        component: () => import('@/views/reportCreditConf/list'),
        meta: { title: '征信配置', icon: 'download' }
      },
    ],
  },
  {
    path: '',
    component: Layout,
    redirect: '',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'lock-open' },
    children: [
      {
        id: 'permissionmgmt',
        path: 'permissionmgmt',
        name: 'permissionmgmt ',//permissionsmgmt
        component: () => import('@/views/permissionsmgmt/permissionsmgmt'),
        meta: { title: '权限管理', icon: 'lock-open' }
      }
    ]
  },
]
*/
const routerMap = {
  'customerList':{
    id: 'customerList',
    path: 'customerList',
    name: '客户查询',
    component: () => import('@/views/customer/list'),
    meta: { title: '客户查询', icon: 'download', id:-1 }
  },
  'assetPackConf': [{
    id: 'assetPackConf',
    path: 'assetPackConf',
    name: 'assetPackConf',
    component: () => import('@/views/assetPackConf/list'),
    meta: { title: '资产包配置', icon: 'download' }
  },
  {
    id: 'assetPackConf',
    path: 'assetPackConf/add',
    name: 'assetPackConfAdd',
    hidden: true,
    component: () => import('@/views/assetPackConf/edit'),
    meta: { title: '资产包配置新增', icon: 'download' }
  },
  {
    id: 'assetPackConf',
    path: 'assetPackConf/edit',
    name: 'assetPackConfEdit',
    hidden: true,
    component: () => import('@/views/assetPackConf/edit'),
    meta: { title: '资产包配置修改', icon: 'download' }
  }],
  'partnerMgmt':[{
    id: 'partnerMgmt',
    path: 'partnerMgmt',
    name: 'partnerMgmt',
    component: () => import('@/views/partnerMgmt/list'),
    meta: { title: '资方管理', icon: 'download' }
  },
  {
    id: 'partnerMgmt',
    path: 'partnerMgmt/add',
    name: 'partnerMgmtAdd',
    hidden: true,
    component: () => import('@/views/partnerMgmt/edit'),
    meta: { title: '资方管理新增', icon: 'download' }
  },
  {
    id: 'partnerMgmt',
    path: 'partnerMgmt/edit',
    name: 'partnerMgmtEdit',
    hidden: true,
    component: () => import('@/views/partnerMgmt/edit'),
    meta: { title: '资方管理修改', icon: 'download' }
  }],
  'ruleConf':[{
    id: 'ruleConf',
    path: 'ruleConf',
    name: 'ruleConf',
    component: () => import('@/views/ruleConf/list'),
    meta: { title: '分发配置', icon: 'download' }
  },
  {
    id: 'ruleConf',
    path: 'ruleConf/add',
    name: 'ruleConfAdd',
    hidden: true,
    component: () => import('@/views/ruleConf/edit'),
    meta: { title: '分发配置新增', icon: 'download' }
  },
  {
    id: 'ruleConf',
    path: 'ruleConf/edit',
    name: 'ruleConfEdit',
    hidden: true,
    component: () => import('@/views/ruleConf/edit'),
    meta: { title: '分发配置修改', icon: 'download' }
  }],
  'channelMgmt':{
    id: 'channelMgmt',
    path: 'channelMgmt',
    name: 'channelMgmt',
    component: () => import('@/views/channelMgmt/list'),
    meta: { title: '渠道管理', icon: 'download' }
  },
  'productIdMgmt':{
    id: 'productIdMgmt',
    path: 'productIdMgmt',
    name: 'productIdMgmt',
    component: () => import('@/views/productIdMgmt/list'),
    meta: { title: '产品号管理', icon: 'download' }
  },
  'urgeRepayConf':{
    id: 'urgeRepayConf',
    path: 'urgeRepayConf',
    name: 'urgeRepayConf',
    component: () => import('@/views/urgeRepayConf/list'),
    meta: { title: '催收配置', icon: 'download' }
  },
  'reportCreditConf':{
    id: 'reportCreditConf',
    path: 'reportCreditConf',
    name: 'reportCreditConf',
    component: () => import('@/views/reportCreditConf/list'),
    meta: { title: '征信配置', icon: 'download' }
  },
  'permissionmgmt':{
    id: 'permissionmgmt',
    path: 'permissionmgmt',
    name: 'permissionmgmt ',
    component: () => import('@/views/permissionsmgmt/permissionsmgmt'),
    meta: { title: '权限管理', icon: 'lock-open' }
  },
  'partnerButtConf':{ //资方配置
    path: 'partnerButtConf',
    name: 'partnerButtConf ',
    component: () => import('@/views/partnerButtConf/list'),
  },
  'requestProcessMgmt':[{ //请求处理
    path: 'requestProcessMgmt',
    name: 'requestProcessMgmt ',
    component: () => import('@/views/requestProcessMgmt/list')
  },{ 
    path: 'requestProcessMgmt/detail/:id?',
    name: 'requestProcessMgmtDetail ',
    component: () => import('@/views/requestProcessMgmt/detail'),
    hidden: true,
    meta: { title: '请求处理详情'}
  }],
  'annexQuery':{ //附件查询
    path: 'annexQuery',
    name: 'annexQuery ',
    component: () => import('@/views/annexQuery/list')
  }, 
  'requestReceiveMgmt':[{ //请求接收
    path: 'requestReceiveMgmt',
    name: 'requestReceiveMgmt ',
    component: () => import('@/views/requestReceiveMgmt/list')
  },{
    path: 'requestReceiveMgmt/detail/:id?',
    name: 'requestReceiveMgmtDetail ',
    component: () => import('@/views/requestReceiveMgmt/detail'),
    hidden: true,
    meta: { title: '请求接收详情'}
  }],
  'exceptionMgmt':{ //异常管理
    path: 'exceptionMgmt',
    name: 'exceptionMgmt ',
    component: () => import('@/views/exceptionMgmt/list')
  },
  'withDrawQuery':{ //提现查询
    path: 'withDrawQuery',
    name: 'withDrawQuery ',
    component: () => import('@/views/withDrawQuery/list')
  },
  'partnerRuleConf':[{ //资方规则配置
    path: 'partnerRuleConf',
    name: 'partnerRuleConf ',
    component: () => import('@/views/partnerRuleConf/list')
  },{ //资方规则配置新增
    path: 'partnerRuleConf/add',
    name: 'partnerRuleConfAdd',
    hidden: true,
    component: () => import('@/views/partnerRuleConf/edit'),
    meta: { title: '资方规则配置新增'}
  },{ //资方规则配置编辑
    path: 'partnerRuleConf/edit',
    name: 'partnerRuleConfEdit',
    hidden: true,
    component: () => import('@/views/partnerRuleConf/edit'),
    meta: { title: '资方规则配置编辑'}
  }],
  'reconciliationFileQuery':{ //对账文件查询
    path: 'reconciliationFileQuery',
    name: 'reconciliationFileQuery ',
    component: () => import('@/views/reconciliationFileQuery/list')
  },
  'kvMgmt':{ //键值对管理
    path: 'kvMgmt',
    name: 'kvMgmt ',
    component: () => import('@/views/kvMgmt/list')
  },
}

export function getRoute(data){
  let routes = []
  for(let i=0; i< data.length;i++){
    let item = data[i]
    if(item.children && item.children.length){
      let children = [];
      for(let j=0; j<item.children.length; j++){
        let item2 = item.children[j];
        if(item2.urlFlag && routerMap[item2.urlFlag]){
          let item2Map = routerMap[item2.urlFlag];
          if(Array.isArray(item2Map)){
            for(let k=0; k<item2Map.length;k++){           
              if(item2Map[k].hidden){
                children.push(item2Map[k])
              }else{
                children.push(Object.assign({},item2Map[k],{
                  id: item2.id,
                  meta: {title: item2.text,id: item2.id}
                }))
              }
              
            }
          }else{
            children.push(
              Object.assign({},routerMap[item2.urlFlag],{
                id: item2.id,
                meta: {title: item2.text,id: item2.id}
              })
            )
          }
        }
      }
      routes.push({
        path:'',
        component: Layout,
        redirect: '',
        name: item.text,
        meta: { title: item.text, icon: '',id:item.id },
        children
      })
    }else{
      if(item.urlFlag && routerMap[item.urlFlag]){
        routes.push({
          path: '',
          name: item.text,
          hasOneShowingChildren: true,
          component: Layout,
          children: [
            Object.assign({},routerMap[item.urlFlag],{
              id: item.id,
              meta: {title: item.text,id: item.id}
            })
          ]
        })
      }
    }
  }
  return routes;
}

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export default router
