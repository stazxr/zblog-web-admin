import router from './routers'
import store from '@/store'
import Config from '@/settings'
// 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import perm from '@/api/base/perm'
import Layout from '@/layout'
import ParentView from '@/components/ParentView'

NProgress.configure({ showSpinner: false })

// no redirect whitelist
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.user.token) {
    if (to.path === '/login') {
      next({ path: '/admin' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1 || to.path.startsWith('/web/')) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})

router.afterEach((to, from) => {
  to.meta.title && (document.title = to.meta.title + ' - ' + Config.title)
  NProgress.done()
})
