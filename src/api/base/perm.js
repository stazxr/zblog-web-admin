import api from './../custom-axios'

const permApi = '/api/perms'

export default {
  // 查询权限列表（树）
  queryPermTreeList: params => {
    return api.httpRequest().get(`${permApi}/treeList`, params)
  },
  // 查询权限详细信息
  queryPermDetail: params => {
    return api.httpRequest().get(`${permApi}/queryPermDetail`, params)
  },
  // 查询权限可访问的接口列表
  queryPermInterfaces: params => {
    return api.httpRequest().get(`${permApi}/queryPermInterfaces`, params)
  },
  // 查询可以访问权限的角色列表
  queryPermRoles: params => {
    return api.httpRequest().get(`${permApi}/queryPermRoles`, params)
  },
  // 查询权限的操作日志列表
  queryPermLogs: params => {
    return api.httpRequest().get(`${permApi}/queryPermLogs`, params)
  },
  // 查询权限树
  queryPermTree: params => {
    return api.httpRequest().get(`${permApi}/tree`, params)
  },
  // 查询权限编码列表
  queryPermCodes: params => {
    return api.httpRequest().get(`${permApi}/queryPermCodes`, params)
  },
  // 查询权限信息
  queryPermInfo: params => {
    return api.httpRequest().get(`${permApi}/queryPermInfo`, params)
  },
  // 新增权限
  addPerm: params => {
    return api.httpRequest().post(`${permApi}/addPerm`, params)
  },
  // 编辑权限
  editPerm: params => {
    return api.httpRequest().post(`${permApi}/editPerm`, params)
  },
  // 删除权限
  deletePerm: params => {
    return api.httpRequest().post(`${permApi}/deletePerm`, params)
  },
  // 查询用户菜单列表
  buildUserMenus: params => {
    return api.httpRequest().get(`${permApi}/queryUserMenus`, params)
  }
}
