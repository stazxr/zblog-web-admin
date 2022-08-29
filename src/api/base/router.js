import api from '../custom-axios'

export default {
  // 根据权限编码查询路由信息
  queryRouterByCode: params => {
    return api.httpRequest().get(`/api/router/queryRouterByCode`, params)
  }
}
