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
  // 获取当前登录人信息
  loginId: params => {
    return api.httpRequest().get(`/api/auth/loginId`, params)
  },
  // 发送邮箱验证码
  sendEmailCode: params => {
    return api.httpRequest().post(`/api/email/sendCode`, params)
  },
  // 生成一个全局ID
  getId: params => {
    return api.httpRequest().get(`/api/id/getId`, params)
  }
}
