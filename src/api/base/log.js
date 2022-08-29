import api from '../custom-axios'

export default {
  // 查询用户操作日志记录
  queryUserLog: params => {
    return api.httpRequest().get(`/api/logs/queryUserLog`, params)
  },
  // 查询权限的操作日志列表
  queryPermLog: params => {
    return api.httpRequest().get(`/api/logs/queryPermLog`, params)
  }
}
