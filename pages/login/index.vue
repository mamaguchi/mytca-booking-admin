<template>
  <v-container fill-height fluid>
    <v-row align="center">
      <v-card
        class="mx-auto"
        max-width="400"
      >
        <ValidationObserver ref="clinicValidObserver" v-slot="{ invalid }">
          <v-card-text>
            <v-list-item three-line>
              <v-list-item-content class="mt-4">
                <div class="my_text_h4 text-center font-weight-bold">
                  <span class="blue--text text--lighten-1">m</span><span class="blue--text text--lighten-2">y</span><span class="blue--text text--lighten-1">TCA</span>
                </div>

                <v-list-item-title class="my_text_h5 text-center mt-2 mb-6">
                  Sign in
                </v-list-item-title>

                <p v-if="loginErr" class="error">
                  {{ loginErr }}
                </p>

                <p v-if="signupStatus" class="blue--text text--lighten-1">
                  {{ signupStatus }}
                </p>

                <ValidationProvider v-slot="{ errors }" rules="numeric">
                  <v-text-field
                    v-model="userId"
                    outlined
                    label="IC Number"
                    :error-messages="idErrMsg || errors"
                    @input="idErrMsg=''"
                  />
                </ValidationProvider>

                <v-text-field
                  v-model="userPwd"
                  outlined
                  label="Password"
                  :error-messages="pwdErrMsg"
                  :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPwd ? 'text' : 'password'"
                  @click:append="showPwd = !showPwd"
                  @input="pwdErrMsg=''"
                />

                <nuxt-link
                  to="/clinicadmin/service"
                  class="mynuxtlink"
                >
                  Forgot password?
                </nuxt-link>

                <span class=" mt-2">
                  No account?
                  <nuxt-link
                    to="/signup"
                    class="mynuxtlink"
                  >
                    Sign up now!
                  </nuxt-link>
                </span>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              class="mr-6 mt-n6 mb-6"
              @click="signin(invalid)"
            >
              Next
            </v-btn>
          </v-card-actions>
        </ValidationObserver>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions } from 'vuex'

export default {

  components: {
    ValidationObserver,
    ValidationProvider
  },

  data () {
    return {
      userId: '',
      userPwd: '',
      showPwd: false,
      idErrMsg: '',
      pwdErrMsg: '',
      loginErr: null
    }
  },

  computed: {
    signupStatus () {
      return this.$store.getters['auth/getSignupStatus']
    }
  },

  methods: {
    ...mapActions('auth', {
      login: 'login'
    }),

    async signin (formInvalid) {
      if (this.userId === '') {
        this.idErrMsg = 'Please enter a valid IC number'
      }
      if (this.userPwd === '') {
        this.pwdErrMsg = 'Please enter your login password'
      }

      if (formInvalid) { return }

      try {
        this.$store.commit('auth/SET_SIGNUP_STATUS', '')
        await this.login({
          userId: this.userId,
          userPwd: this.userPwd
        })
      } catch (error) {
        // this.loginErr = error //this gives an unfriendly error msg
        this.loginErr = 'Unable to login at the moment, please try again later'
      }
    }

  }
}
</script>

<style scoped>

.mynuxtlink {
    text-decoration: none;
}

.my_text_h4 {
   font-size: xx-large;
}

.my_text_h5 {
   font-size: x-large;
}

</style>
