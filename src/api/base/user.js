import api from '../custom-axios'

const userApi = '/api/users'

export default {
  // 修改头像
  updateUserHeadImg: params => {
    return api.httpRequest().post(`${userApi}/updateUserHeadImg`, params)
  },
  // 修改个人基础信息
  updateUserBaseInfo: params => {
    return api.httpRequest().post(`${userApi}/updateUserBaseInfo`, params)
  },
  // 修改用户密码
  updateUserPass: params => {
    return api.httpRequest().post(`${userApi}/updateUserPass`, params)
  },
  // 修改用户邮箱
  updateUserEmail: params => {
    return api.httpRequest().post(`${userApi}/updateUserEmail`, params)
  },
  // 分页查询用户列表（公共方法）
  pageListOfCommon: params => {
    return api.httpRequest().get(`${userApi}/pageListOfCommon`, params)
  }
}
