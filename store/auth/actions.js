import qs from 'qs'

const cookies = process.client ? require('js-cookie') : undefined

export default {
  async login (context, { userId, userPwd }) {
    const payload = {}
    payload.userId = userId
    payload.userPwd = userPwd
    const payloadData = qs.stringify(payload)
    const { data } = await this.$axios.post('http://localhost:8082/public/login', payloadData)

    cookies.set('auth', data)
    context.commit('setAuth', data)

    this.$router.push('/clinicadmin')
  },

  logout ({ commit }) {
    // Delete the client side cookie: auth.
    cookies.remove('auth')

    // Remove data from the state.
    commit('setAuth', null)
  },

  async signup (context, formData) {
    const payloadData = qs.stringify(formData)
    const { data } = await this.$axios.post('http://localhost:8082/public/signup', payloadData)

    return data.createAccResCode
  }
}
