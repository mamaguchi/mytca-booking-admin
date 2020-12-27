export const strict = false

export const state = () => ({
  barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
  barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
  drawer: null
})

export const mutations = {
  SET_BAR_IMAGE (state, payload) {
    state.barImage = payload
  },
  SET_DRAWER (state, payload) {
    state.drawer = payload
  }
}

const cookie = process.server ? require('cookie') : undefined

// store/index.js
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    // eslint-disable-next-line
    if (req.headers.cookie && req.headers.cookie.indexOf('auth') > -1) {
      // eslint-disable-next-line
      let auth = cookie.parse(req.headers.cookie)['auth']
      commit('auth/setAuth', JSON.parse(auth))
    }
  }
}
