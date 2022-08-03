import api from './custom-axios'

export default {
  // 登录
  login: params => {
    return api.httpRequest().post(`/api/process`, params)
  },
  // 登出
  logout: params => {
    return api.httpRequest().post(`/logout`, params)
  },
  // 获取登录验证码
  loginCode: params => {
    return api.httpRequest().get(`/api/auth/loginCode`, params)
  },
  // 续签
  renewToken: params => {
    return api.httpRequest().post(`/api/auth/renewToken`, params)
  },
  // 获取当前登录人信息
  loginId: params => {
    return api.httpRequest().get(`/api/auth/loginId`, params)
  }
}
