import api from '../custom-axios'

const routerApi = '/api/router'

export default {
  // 分页查询路由列表
  pageRouterList: params => {
    return api.httpRequest().get(`${routerApi}/pageList`, params)
  },
  // 根据权限编码查询路由信息
  queryRouterByCode: params => {
    return api.httpRequest().get(`${routerApi}/queryRouterByCode`, params)
  }
}
