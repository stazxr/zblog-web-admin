import communal from '@/api/communal'
import { getToken, setToken, removeToken, getRefToken, setRefToken, removeRefToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    refToken: getRefToken(),
    user: {},
    roles: [],
    loadMenus: false // 第一次加载菜单时用到
  },
  mutations: {
    SET_TOKEN: (state, token, refToken) => {
      state.token = token
      state.refToken = refToken
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },
  actions: {
    Login({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        communal.login(loginParam).then(res => {
          console.log('res', res)

          // 存储Token
          const accessToken = res.data['access_token']
          const refreshToken = res.data['refresh_token']
          setToken(accessToken)
          setRefToken(refreshToken)
          commit('SET_TOKEN', accessToken, refreshToken)

          // 设置用户信息
          const additional = res.data['additional']
          setUserInfo(additional.user, commit)

          // 第一次加载菜单时用到，具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        communal.logout().then(() => {
          logout(commit)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateLoadMenus({ commit }, flag) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', flag)
      })
    }
  }
}

export const logout = (commit) => {
  commit('SET_TOKEN', '', '')
  commit('SET_ROLES', [])
  removeToken()
  removeRefToken()
}

export const setUserInfo = (user, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  commit('SET_ROLES', user['authorities'] || [])
  commit('SET_USER', user)
}

export default user
