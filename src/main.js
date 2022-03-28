import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import api from './api/http_index';
import httpConfig from './api/http-config'

Vue.prototype.$mapi = api;
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(httpConfig)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
