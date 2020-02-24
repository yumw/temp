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

export const asyncRouterMap = [
  // {
  //   path: '/casemgmt',
  //   component: Layout,
  //   redirect: '/casemgmt/LoanApplyList',
  //   name: '进件管理',
  //   meta: { title: '进件管理', icon: 'info' },
  //   children: [
  //     {
  //       id: 'LoanApplyList',
  //       path: 'LoanApplyList',
  //       name: '进件申请列表',
  //       component: () => import('@/views/casemgmt/LoanApplyList'),
  //       meta: { title: '进件申请列表', icon: 'table' }
  //     },
  //     {
  //       path: 'LoanApplyListDetail/:serialNumber',
  //       name: '进件查看详情',
  //       component: () => import('@/views/casemgmt/LoanApplyListDetail'),
  //       meta: { title: '进件查看详情' },
  //       hidden: true
  //     },
  //     {
  //       id: 'LoanAccessoryList',
  //       path: 'LoanAccessoryList',
  //       name: '贷款附件列表',
  //       component: () => import('@/views/casemgmt/LoanAccessoryList'),
  //       meta: { title: '贷款附件列表', icon: 'tree' }
  //     },
  //     {
  //       id: 'WithDrawList',
  //       path: 'WithDrawList',
  //       name: '循环提现列表',
  //       component: () => import('@/views/casemgmt/WithDrawList'),
  //       meta: { title: '循环提现列表', icon: 'tree' }
  //     },
  //     {
  //       id: 'RepayList',
  //       path: 'RepayList',
  //       name: '还款结清列表',
  //       component: () => import('@/views/casemgmt/RepayList'),
  //       meta: { title: '还款结清列表', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/channelmgmt',
  //   component: Layout,
  //   redirect: '/channelmgmt/ChannelCfg',
  //   name: '渠道管理',
  //   meta: { title: '渠道管理', icon: 'channelmgmt' },
  //   children: [
  //     {
  //       id: 'ChannelCfg',
  //       path: 'ChannelCfg',
  //       name: '渠道配置',
  //       component: () => import('@/views/channelmgmt/ChannelCfg'),
  //       meta: { title: '渠道配置', icon: 'table' }
  //     },
  //     {
  //       id: 'MerchantCfg',
  //       path: 'MerchantCfg',
  //       name: '商户配置',
  //       component: () => import('@/views/channelmgmt/MerchantCfg'),
  //       meta: { title: '商户配置', icon: 'tree' }
  //     },
  //     {
  //       id: 'ProductCfg',
  //       path: 'ProductCfg',
  //       name: '产品配置',
  //       component: () => import('@/views/channelmgmt/ProductCfg'),
  //       meta: { title: '产品配置', icon: 'tree' }
  //     },
  //     {
  //       id: 'SmsValidateMgmt',
  //       path: 'SmsValidateMgmt',
  //       name: '短信校验管理',
  //       component: () => import('@/views/channelmgmt/SmsValidateMgmt'),
  //       meta: { title: '短信校验管理', icon: 'tree' }
  //     }
  //   ]
  // },
  // // {
  // //   path: '/servicemgmt',
  // //   component: Layout,
  // //   redirect: '/servicemgmt/ServiceCfg',
  // //   name: '服务管理',
  // //   meta: { title: '服务管理', icon: 'table' },
  // //   children: [
  // //     {
  // //       id: 'ServiceCfg',
  // //       path: 'ServiceCfg',
  // //       name: '服务配置',
  // //       component: () => import('@/views/servicemgmt/ServiceCfg'),
  // //       meta: { title: '服务配置', icon: 'table' }
  // //     },
  // //     {
  // //       id: 'MerchantServiceCfg',
  // //       path: 'MerchantServiceCfg',
  // //       name: '商户服务配置',
  // //       component: () => import('@/views/servicemgmt/MerchantServiceCfg'),
  // //       meta: { title: '商户服务配置', icon: 'tree' }
  // //     }
  // //   ]
  // // },
  // {
  //   path: '/taskmgmt',
  //   component: Layout,
  //   redirect: '/taskmgmt/RequestMgmt',
  //   name: '任务管理',
  //   meta: { title: '任务管理', icon: 'task' },
  //   children: [
  //     {
  //       id: 'RequestMgmt',
  //       path: 'RequestMgmt',
  //       name: '请求管理',
  //       component: () => import('@/views/taskmgmt/RequestMgmt'),
  //       meta: { title: '请求管理', icon: 'table' }
  //     },
  //     {
  //       id: 'FeedbackMgmt',
  //       path: 'FeedbackMgmt',
  //       name: '反馈管理',
  //       component: () => import('@/views/taskmgmt/FeedbackMgmt'),
  //       meta: { title: '反馈管理', icon: 'tree' }
  //     },
  //     {
  //       id: 'AbnormalMgmt',
  //       path: 'AbnormalMgmt',
  //       name: '异常管理',
  //       component: () => import('@/views/taskmgmt/AbnormalMgmt'),
  //       meta: { title: '异常管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'TaskDetails/:source',
  //       name: '详情',
  //       component: () => import('@/views/taskmgmt/TaskDetails'),
  //       meta: { title: '详情' },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/downloadmgmt',
  //   component: Layout,
  //   redirect: '/downloadmgmt/download',
  //   name: '文件管理',
  //   meta: { title: '文件管理', icon: 'download' },
  //   children: [
  //     {
  //       id: 'download',
  //       path: 'download',
  //       name: '对账文件管理',
  //       component: () => import('@/views/downloadmgmt/Download'),
  //       meta: { title: '对账文件管理', icon: 'download' }
  //     },
  //     {
  //       id: 'downloadFileResult',
  //       path: 'downloadFileResult',
  //       name: '文件拉取管理',
  //       component: () => import('@/views/downloadmgmt/DownloadFileResult'),
  //       meta: { title: '文件拉取管理', icon: 'download' }
  //     }
  //   ]
  // },
  // {
  //   path: '/keyValueMgmt',
  //   component: Layout,
  //   redirect: '/keyValueMgmt/main',
  //   name: '键值对管理',
  //   meta: { title: '键值对管理', icon: 'setting' },
  //   children: [
  //     {
  //       id: 'keyValueMgmt',
  //       path: 'main',
  //       name: '键值对管理 ',
  //       component: () => import('@/views/keyValueMgmt/KeyValueMgmt'),
  //       meta: { title: '键值对管理', icon: 'setting' }
  //     }
  //   ]
  // },
  // {
  //   path: '/permissionsmgmt',
  //   component: Layout,
  //   redirect: '/permissionsmgmt',
  //   name: '权限管理',
  //   meta: { title: '权限管理', icon: 'lock-open' },
  //   children: [
  //     {
  //       id: 'permissionsmgmt',
  //       path: '',
  //       name: '权限管理 ',
  //       component: () => import('@/views/permissionsmgmt/permissionsmgmt'),
  //       meta: { title: '权限管理', icon: 'lock-open' }
  //     }
  //   ]
  // },
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

export const routerMap = {
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
  }
}

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})

export default router
