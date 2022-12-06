import api from '../custom-axios'

const articleApi = '/api/articles'

export default {
  // 分页查询文章列表
  pageArticleList: params => {
    return api.httpRequest().get(`${articleApi}/pageList`, params)
  },
  // 查询文章详情
  queryArticleDetail: params => {
    return api.httpRequest().get(`${articleApi}/queryArticleDetail`, params)
  },
  // 新增文章
  addArticle: params => {
    return api.httpRequest().post(`${articleApi}/addArticle`, params)
  },
  // 编辑文章
  editArticle: params => {
    return api.httpRequest().post(`${articleApi}/editArticle`, params)
  },
  // 删除文章
  deleteArticle: params => {
    return api.httpRequest().post(`${articleApi}/deleteArticle`, params)
  },
  // 查询分类列表
  queryCategoryTree: params => {
    return api.httpRequest().get(`${articleApi}/queryCategoryTree`, params)
  },
  // 查询标签列表
  queryTagList: params => {
    return api.httpRequest().get(`${articleApi}/queryTagList`, params)
  }
}
