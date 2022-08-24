import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import preventReClick from '@/directive/preventReClick'
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss'
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'
import App from './App'
import store from '@/store'
import router from '@/router/routers'
import './assets/icons'
import './assets/iconfont/iconfont.css'
import './router/index'
import 'echarts-gl'
import api from './api/http-index'

// 加载插件
Vue.use(preventReClick)
Vue.use(VueHighlightJS)
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
