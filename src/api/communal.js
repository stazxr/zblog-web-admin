import api from './custom-axios'

const communal = {
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
  }
}

export default communal
