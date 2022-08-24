import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/token'
import { filterAsyncRouter } from '@/utils/router'
import perm from '@/api/base/perm'

NProgress.configure({ showSpinner: false })

// no redirect whitelist
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/admin' })
      NProgress.done()
    } else {
      if (store.getters.user === null) {
        store.dispatch('GetUserInfo').then(() => {
          loadMenus(next, to)
        }).catch(() => {
          store.dispatch('Logout').then(() => {
            location.reload()
          })
        })
      } else if (store.getters.loadMenus) {
        store.dispatch('UpdateLoadMenus').then(_ => {
          loadMenus(next, to)
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  to.meta.title && (document.title = to.meta.title + ' - ' + Config.title)
  NProgress.done()
})

export const loadMenus = (next, to) => {
  perm.buildMenus().then(res => {
    const data = res.data
    const sdata = JSON.parse(JSON.stringify(data))
    const rdata = JSON.parse(JSON.stringify(data))
    const sidebarRoutes = filterAsyncRouter(sdata)
    const rewriteRoutes = filterAsyncRouter(rdata, false, true)
    rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })

    store.dispatch('GenerateRoutes', rewriteRoutes).then(() => {
      router.addRoutes(rewriteRoutes)
      next({ ...to, replace: true })
    })

    store.dispatch('SetSidebarRouters', sidebarRoutes)
  })
}
