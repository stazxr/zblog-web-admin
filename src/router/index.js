import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import perm from '@/api/base/perm'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title // 拼接标题
  }

  NProgress.start()
  if (getToken()) {
    console.log('aaaaaaa')
    // has token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log('store.getters.loadMenus', store.getters.loadMenus)
      if (store.getters.loadMenus) {
        console.log('11111111')
        // 拉取菜单
        loadMenus(next, to)
      } else {
        console.log('222222222')
        next()
      }
    }
  } else {
    console.log('bbbbbbbbbb')
    // has no token
    if (whiteList.indexOf(to.path) !== -1 || to.path.startsWith('/web/')) {
      // 在免登录白名单，或者是WEB请求，则无视
      console.log('has no token, white list')
      next()
    } else {
      // 重定向到登录页
      console.log('has no token, go login')
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  perm.buildMenus({}).then(res => {
    console.log('menu res', res)
    const data = res.data
    console.log('menu', data)
    store.dispatch('UpdateLoadMenus', false)
    const sdata = JSON.parse(JSON.stringify(data))
    const rdata = JSON.parse(JSON.stringify(data))
    const sidebarRoutes = filterAsyncRouter(sdata)
    const rewriteRoutes = filterAsyncRouter(rdata, false, true)
    rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })

    store.dispatch('GenerateRoutes', rewriteRoutes).then(() => { // 存储路由
      router.addRoutes(rewriteRoutes) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
    store.dispatch('SetSidebarRouters', sidebarRoutes)
  }).catch(e => {
    console.log('loadMenus catch eor', e)
    store.dispatch('UpdateLoadMenus', true)
    NProgress.done()
  })
}

router.afterEach(() => {
  NProgress.done() // 完成进度条
})
