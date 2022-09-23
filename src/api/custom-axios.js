import axios from 'axios'
import { Message } from 'element-ui'
import JSONBIG from 'json-bigint'
import { setToken, getToken, removeToken } from '@/utils/token'

const defaultTimeout = 120000

// create instance
const instance = axios.create()

// baseURL
instance.defaults.baseURL = process.env.VUE_APP_BASE_API

// 超时时间
instance.defaults.timeout = defaultTimeout

// 处理超过16位数字精度丢失问题
instance.defaults.transformResponse = [
  function(data) {
    if (data instanceof Blob) {
      return data
    }

    const json = JSONBIG({
      storeAsString: true
    })
    return json.parse(data)
  }
]

// 是否允许携带凭证
instance.defaults.withCredentials = true

// 自定义响应成功的HTTP状态码
instance.defaults.validateStatus = status => {
  // default: status >= 200 && status < 300
  // 3XX: 临时重定向，永久重定向，缓存
  return /^([23])\d{2}$/.test(String(status))
}

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

// 设置响应拦截器
instance.interceptors.response.use(response => {
  // response {data: {}, status: 200, statusText: 'OK', headers: {}, config: {}, request: {}}
  // data formatter: {code: 200, message, '操作成功', data: {}, identifier: 1} => code maybe [200, 401, 403, 404, 500...]
  // data maybe really data, eg: data => 后端直接返回了数据，没有封装为上述格式
  // return Promise.reject(new Error(res.msg || 'Error'))
  if (response.status === 200 && response.data) {
    // refresh Token
    if (response.headers['new-token'] !== undefined && response.headers['new-token'] !== '') {
      setToken(response.headers['new-token'])
      console.log('refresh token success')
    }

    const result = response.data
    const code = result.code || 200
    if (code === 200) {
      // success, return data
      return response.data
    } else if (code === 401) {
      const identifier = result.identifier || 900001
      if (identifier === 10008) {
        Message.error(result.message || '登录失败')
        return Promise.reject(new Error(result.message || '登录失败'))
      } else if (identifier === 10009) {
        Message.error(result.message || '请修改密码')
        return Promise.reject(new Error(result.message || '请修改密码'))
      } else if (identifier === 900002) {
        logout(true)
      } else if (identifier === 900003 || identifier === 900004) {
        Message.error(result.message || '系统异常')
        return Promise.reject(new Error(result.message || '系统异常'))
      } else {
        Message.error(result.message || '请登录')
        logout(false)
      }
    } else if (code === 403) {
      Message.error('权限不足，请联系管理员')
      return Promise.reject(new Error('403'))
    } else if (response.data.code === 404) {
      Message.error(result.message || '请求资源不存在')
      return Promise.reject(new Error(result.message || '404'))
    } else {
      Message.error(result.message || '系统发生未知错误')
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
        logout(false)
        break
      case 403:
        errorMsg = '权限不足，请联系管理员添加权限'
        break
      case 404:
        errorMsg = '请求资源不存在'
        break
      case 503:
        errorMsg = '系统繁忙，请稍后再试'
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
        errorMsg = '服务无响应'
      }
    }
  } else {
    // 发送请求失败
    errorMsg = '请求发送失败'
  }

  Message.error(errorMsg || '系统发生未知错误')
  return Promise.reject(new Error(errorMsg))
})

function logout(expired) {
  if (expired) {
    window.sessionStorage.setItem('point', 401)
  }

  removeToken()
  location.reload()
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
