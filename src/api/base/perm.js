import api from './../custom-axios'

export default {
  // 查询权限列表
  list: params => {
    return api.httpRequest().get(`/api/perms/list`, params)
  },
  // 构建用户菜单树
  buildMenus: params => {
    return api.httpRequest().get(`/api/perms/buildMenus`, params)
  },
  // 查找所有注册的权限编码
  queryPermCodes: params => {
    return api.httpRequest().get(`/api/perms/queryPermCodes`, params)
  },
  // 新增权限
  addPerm: params => {
    return api.httpRequest().post(`/api/perms/addPerm`, params)
  },
  // 编辑权限
  editPerm: params => {
    return api.httpRequest().post(`/api/perms/editPerm`, params)
  },
  // 删除权限
  deletePerm: params => {
    return api.httpRequest().post(`/api/perms/deletePerm`, params)
  },
  // 查询权限详情
  queryPermDetail: params => {
    return api.httpRequest().get(`/api/perms/queryPermDetail`, params)
  },
  // 删除权限对应的角色信息
  deletePermRole: params => {
    return api.httpRequest().post(`/api/perms/deletePermRole`, params)
  }
}
