import axios from 'axios'
import Config from '@/settings'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import store from '@/store'

import { getToken, getRefToken, removeTokenPair } from '@/utils/token'

// create instance
const instance = axios.create()

// baseURL
instance.defaults.baseURL = process.env.VUE_APP_BASE_API

// 超时时间
instance.defaults.timeout = Config.timeout

// 是否允许携带凭证
instance.defaults.withCredentials = true

// 设置请求拦截器
instance.interceptors.request.use(config => {
  // set default header
  config.headers.Authorization = getToken()
  config.headers['Content-Type'] = 'application/json;charset=UTF-8'

  // return config
  return config
}, error => {
  return Promise.reject(error)
})

// 自定义响应成功的HTTP状态码
instance.defaults.validateStatus = status => {
  // default: status >= 200 && status < 300
  // 3XX: 临时重定向，永久重定向，缓存
  return /^([23])\d{2}$/.test(String(status))
}

// 是否在续签
let refreshing = false

// 请求等待队列
let reqWaitQueue = []

// 设置响应拦截器
instance.interceptors.response.use(response => {
  // response {data: {}, status: 200, statusText: 'OK', headers: {}, config: {}, request: {}}
  // data formatter: {code: 200, message, '操作成功', data: {}, identifier: 1} => code maybe [200, 401, 403, 404, 500...]
  // data maybe really data, eg: data => 后端直接返回了数据，没有封装为上述格式
  // return Promise.reject(new Error(res.msg || 'Error'))
  if (response.status === 200 && response.data) {
    const result = response.data
    const code = result.code || 200
    if (code === 200) {
      // success, return data
      return response.data
    } else if (code === 401) {
      // identifier: 900999-未登录; 900006-身份认证异常; 900004-RTK 过期，不可续签; 900001-ATK 过期，可续签
      const identifier = result.identifier || 900999
      if (identifier === 900001) {
        // renew token
        const config = response.config
        if (refreshing === false) {
          // push this
          refreshing = true
          new Promise(resolve => {
            reqWaitQueue.push(() => {
              config.headers.Authorization = getToken()
              resolve(instance(config))
            })
          }).then()

          // refresh token
          const rtk = getRefToken()
          return store.dispatch('user/RefreshToken', rtk).then(() => {
            config.headers.Authorization = getToken()
            reqWaitQueue.forEach(callBack => callBack())
            reqWaitQueue = []
          }).catch(() => {
            // 续签失败，清除token，跳转登录页
            logout()
          }).finally(() => {
            refreshing = false
          })
        } else {
          return new Promise(resolve => {
            reqWaitQueue.push(() => {
              config.headers.Authorization = getToken()
              resolve(instance(config))
            })
          })
        }
      } else if (identifier === 10008) {
        // 10008 登录失败
        Message.error({ message: result.message || '登录失败' })
        return Promise.reject(new Error(result.message || '登录失败'))
      } else if (identifier === 10009) {
        // TODO 10019 密码过期，跳转修改密码页
        Message.error({ message: result.message || '请修改密码' })
        return Promise.reject(new Error(result.message || '请修改密码'))
      } else {
        // 登录过期，跳转登录页
        logout()
      }
    } else if (code === 403) {
      Message.error({ message: '权限不足，请联系管理员' })
      return Promise.reject(new Error('403'))
    } else if (response.data.code === 404) {
      Message.error({ message: result.message || '请求资源不存在' })
      return Promise.reject(new Error(result.message || '404'))
    } else {
      Message.error({ message: result.message || '系统发生未知错误' })
      return Promise.reject(new Error(result.message || '系统发生未知错误'))
    }
  }
}, error => {
  // 统一异常处理，一般不会出现401|403|404，后端将其作为业务异常处理了
  let errorMsg
  const { response, request } = error
  if (response) {
    // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    switch (response.status) {
      case 400:
        errorMsg = '请求数据格式不正确'
        break
      case 401:
        logout()
        break
      case 403:
        errorMsg = '权限不足，请联系管理员添加权限'
        break
      case 404:
        errorMsg = '请求资源不存在'
        break
      default:
        errorMsg = '系统发生未知错误'
        break
    }
  } else if (request) {
    // 请求已经成功发起，但没有收到响应
    if (!window.navigator.onLine) {
      // 断网处理
      errorMsg = '服务迷失在了大千网络世界中，请等候它回来'
    } else {
      if (error.message && error.message.includes('timeout')) {
        errorMsg = '请求超时'
      } else {
        errorMsg = '服务无响应，请稍后再试'
      }
    }
  } else {
    // 发送请求失败
    errorMsg = '请求发送失败'
  }

  Message.error({ message: errorMsg })
  return Promise.reject(new Error(errorMsg))
})

function logout() {
  store.dispatch('user/ClearUserInfo').then(() => {
    window.sessionStorage.removeItem('vuex')
    Cookies.set('point', 401)
    location.reload()
  })
}

export const get = (url, params, requestItem) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'get',
      url: url,
      // 是与请求一起发送的 URL 参数，必须是一个简单对象或 URLSearchParams 对象
      params: params,
      // 自定义请求头
      headers: {},
      // 浏览器将要响应的数据类型，['arraybuffer', 'document', 'json', 'text', 'stream', 'blob'(浏览器专属)]
      responseType: 'json'
    }

    options = Object.assign({}, options, requestItem)
    instance(options).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const post = (url, params, requestItem) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'post',
      url: url,
      // 作为请求体被发送的数据，[string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams]
      // 浏览器专属: FormData, File, Blob; Node 专属: Stream, Buffer
      // 可选语法，Country=China&City=Xian，只有 value 会被发送，key 则不会
      data: params,
      // 自定义请求头
      headers: {},
      // 浏览器将要响应的数据类型，['arraybuffer', 'document', 'json', 'text', 'stream', 'blob'(浏览器专属)]
      responseType: 'json'
    }

    options = Object.assign({}, options, requestItem)
    instance(options).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export default {
  httpRequest() {
    return {
      get,
      post
    }
  }
}
