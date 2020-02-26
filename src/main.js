import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import * as filters from './utils/filters'

import '@/icons' // icon
import '@/permission' // permission control


Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.hasPerm = function(permission){
  let btns = store.state.permission.btns;
  return btns.indexOf(permission) > -1;
}


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
