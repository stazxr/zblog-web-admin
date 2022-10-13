import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import perm from '@/directive/perm'
import checkPerm from '@/directive/checkPerm'
import preventReClick from '@/directive/preventReClick'
import Highlight from '@/directive/highlight'
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss'
import App from './App'
import store from '@/store'
import router from '@/router/routers'
import './assets/icons'
import './assets/iconfont/iconfont.css'
import './router/index'
import 'echarts-gl'
import api from './api/http-index'
import 'default-passive-events'

// 加载插件
Vue.use(perm)
Vue.use(checkPerm)
Vue.use(preventReClick)
Vue.use(Highlight)
Vue.use(mavonEditor)
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// 声明全局变量
Vue.prototype['$mapi'] = api

// 关闭提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
