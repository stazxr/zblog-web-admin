import api from './../custom-axios'

const perm = {
  // 登录
  buildMenus: params => {
    return api.httpRequest().get(`/api/perms/buildMenus`, params)
  }
}

export default perm
