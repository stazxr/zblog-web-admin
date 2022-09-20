import api from '../custom-axios'

const dictApi = '/api/dict'

export default {
  // 分页查询字典列表
  pageDictList: params => {
    return api.httpRequest().get(`${dictApi}/pageList`, params)
  }
}
