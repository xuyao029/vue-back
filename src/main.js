import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import ZkTable from 'vue-table-with-tree-grid'
//导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须 return config
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component(ZkTable.name, ZkTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
