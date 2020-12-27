export default {

  setAuth (state, authData) {
    state.auth = authData
  },

  setPrevRoute (state, prevRoute) {
    state.prevRoute = prevRoute
  },

  SET_SIGNUP_STATUS (state, signupStatus) {
    state.signupStatus = signupStatus
  }

}
