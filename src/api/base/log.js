import api from '../custom-axios'

export default {
  // 查询用户操作日志记录
  queryUserLog: params => {
    return api.httpRequest().get(`/api/logs/queryUserLog`, params)
  }
}
