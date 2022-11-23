import api from '../custom-axios'

const categoryApi = '/api/categories'

export default {
  // 分页查询类别列表
  queryCategoryTreeList: params => {
    return api.httpRequest().get(`${categoryApi}/treeList`, params)
  },
  // 查询一级类别列表
  queryFirstCategoryList: params => {
    return api.httpRequest().get(`${categoryApi}/queryFirstCategoryList`, params)
  },
  // 查询类别详情
  queryCategoryDetail: params => {
    return api.httpRequest().get(`${categoryApi}/queryCategoryDetail`, params)
  },
  // 新增类别
  addCategory: params => {
    return api.httpRequest().post(`${categoryApi}/addCategory`, params)
  },
  // 编辑类别
  editCategory: params => {
    return api.httpRequest().post(`${categoryApi}/editCategory`, params)
  },
  // 删除类别
  deleteCategory: params => {
    return api.httpRequest().post(`${categoryApi}/deleteCategory`, params)
  }
}
