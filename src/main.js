import Vue from 'vue'
import App from './App'
import router from './router/routers'
import ElementUI from 'element-ui'
import store from './store'
import Cookies from 'js-cookie'
import './router/index'
import './assets/styles/element-variables.scss'
import 'normalize.css/normalize.css'

// icon
import './assets/icons'
import './assets/iconfont/iconfont.css'

// global css
import './assets/styles/index.scss'

// import other
import api from './api/http-index'

// 关闭提示
Vue.config.productionTip = false

// 声明全局变量
Vue.prototype['$mapi'] = api

// 加载插件
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// 前端防多次点击，重复提交 use: v-preventReClick || v-preventReClick = '1000'
Vue.directive('preventReClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el['disabled']) {
        el['disabled'] = true
        setTimeout(() => {
          el['disabled'] = false
        }, binding.value || 3000)
      }
    })
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
