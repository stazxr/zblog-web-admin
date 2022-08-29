import api from '../custom-axios'

export default {
  // 查询权限对应的接口详情
  queryPermInterface: params => {
    return api.httpRequest().get(`/api/interfaces/queryPermInterface`, params)
  }
}
