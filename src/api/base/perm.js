import api from './../custom-axios'

export default {
  // 登录
  buildMenus: params => {
    return api.httpRequest().get(`/api/perms/buildMenus`, params)
  }
}
