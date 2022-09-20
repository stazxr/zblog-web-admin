import api from '../custom-axios'

const logApi = '/api/logs'

export default {
  // 分页查询操作日志列表
  queryOperateLogsByPage: params => {
    return api.httpRequest().get(`${logApi}/queryOperateLogsByPage`, params)
  },
  // 分页查询接口日志列表
  queryApiLogsByPage: params => {
    return api.httpRequest().get(`${logApi}/queryApiLogsByPage`, params)
  },
  // 查询用户操作日志记录
  queryUserLog: params => {
    return api.httpRequest().get(`${logApi}/queryUserLog`, params)
  }
}
