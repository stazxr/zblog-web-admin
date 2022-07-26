import { getRefToken, getToken, setTokenPair, removeTokenPair } from '@/utils/token'
import communal from '@/api/communal'

const state = {
  token: getToken(),
  refToken: getRefToken(),
  user: {},
  userRole: {},
  loadMenus: false
}

const mutations = {
  SET_TOKEN: (state) => {
    state.token = getToken()
    state.refToken = getRefToken()
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_USER_ROLE: (state, userRole) => {
    state.userRole = userRole
  },
  SET_LOAD_MENUS: (state, flag) => {
    state.loadMenus = flag
  }
}

const actions = {
  SetToken({ commit }, tokenPair) {
    setTokenPair(tokenPair)
    commit('SET_TOKEN')
  },
  SetUser({ commit }, user) {
    const { authorities } = user
    commit('SET_USER', user)
    commit('SET_USER_ROLE', authorities || [])
  },
  SetLoadMenus({ commit }, flag) {
    commit('SET_LOAD_MENUS', flag)
  },
  ClearUserInfo({ commit }) {
    removeTokenPair()

    commit('SET_TOKEN')
    commit('SET_USER', {})
    commit('SET_USER_ROLE', [])
  },
  RefreshToken({ commit }, rtk) {
    return new Promise((resolve, reject) => {
      communal.renewToken({ rtk: rtk }).then(res => {
        // clear token
        removeTokenPair()
        commit('SET_TOKEN')

        // set new token
        const { atk, rtk } = res.data
        setTokenPair({ atk: atk, rtk: rtk })
        commit('SET_TOKEN')
        resolve(atk)
      }).catch(e => {
        reject(e)
      })
    })
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
