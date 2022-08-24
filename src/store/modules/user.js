import communal from '@/api/communal'
import { setToken, removeToken } from '@/utils/token'

const user = {
  state: {
    user: null,
    loadMenus: false
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },
  actions: {
    // 登录
    Login({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        communal.login(loginParam).then(res => {
          const { access_token } = res.data
          setToken(access_token)
          setUserInfo(commit)
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        communal.loginId().then(res => {
          commit('SET_USER', res.data)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        communal.logout().then(_ => {
          logout(commit)
          resolve()
        }).catch(error => {
          logout(commit)
          reject(error)
        })
      })
    },
    UpdateLoadMenus({ commit }) {
      return new Promise(() => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logout = (commit) => {
  commit('SET_USER', null)
  removeToken()
}

export const setUserInfo = (commit) => {
  communal.loginId().then(res => {
    commit('SET_USER', res.data)
  })
}

export default user
