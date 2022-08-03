import api from '../custom-axios'

export default {
  // 修改头像
  updateUserHeadImg: params => {
    return api.httpRequest().post(`/api/users/updateUserHeadImg`, params)
  },
  // 修改个人基础信息
  updateUserBaseInfo: params => {
    return api.httpRequest().post(`/api/users/updateUserBaseInfo`, params)
  },
  // 修改用户密码
  updateUserPass: params => {
    return api.httpRequest().post(`/api/users/updateUserPass`, params)
  }
}
