import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

const state = {
  theme: variables.theme,
  showSettings: false,
  title: defaultSettings.title,
  tokenKey: defaultSettings.tokenKey,
  refTokenKey: defaultSettings.refTokenKey,
  timeout: defaultSettings.timeout,
  tagsView: defaultSettings.tagsView,
  fixedHeader: defaultSettings.fixedHeader,
  sidebarLogo: defaultSettings.sidebarLogo,
  showFooter: defaultSettings.showFooter,
  footerTxt: defaultSettings.footerTxt,
  caseNumber: defaultSettings.caseNumber
}

const forbiddenKey = ['tokenKey', 'refTokenKey']

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      if (forbiddenKey.indexOf() === -1) {
        state[key] = value
      }
    }
  }
}

const actions = {
  ChangeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
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
