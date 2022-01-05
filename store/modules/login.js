const state = {
  userInfo: ''
}

const mutations = {
  setUserInfo(state, data) {
	  state.userInfo = data
  }
}

const actions = {

}

const getters = {
	userInfo(state) {
		return state.userInfo
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
