import api from '../custom-axios'

export default {
  // 查询权限对应的角色详情
  queryPermRole: params => {
    return api.httpRequest().get(`/api/roles/queryPermRole`, params)
  }
}
