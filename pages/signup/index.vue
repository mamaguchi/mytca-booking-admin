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
                  Sign up
                </v-list-item-title>

                <p v-if="signupErr" class="error mb-4">
                  {{ signupErr }}
                </p>

                <ValidationProvider v-slot="{ errors }" rules="required|numeric|min:12">
                  <v-text-field
                    v-model="userId"
                    outlined
                    label="IC Number"
                    counter
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required|min:8">
                  <v-text-field
                    v-model="userPwd"
                    outlined
                    label="Password"
                    counter
                    hint="At least 8 characters"
                    :error-messages="errors"
                    :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPwd ? 'text' : 'password'"
                    @click:append="showPwd = !showPwd"
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required">
                  <v-text-field
                    v-model="userName"
                    outlined
                    label="Name (as in IC)"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required">
                  <v-text-field
                    v-model="userAddress"
                    outlined
                    label="Address"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required">
                  <v-text-field
                    v-model="userTelephone"
                    outlined
                    label="Telephone"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required|email">
                  <v-text-field
                    v-model="userEmail"
                    v-validate="'email'"
                    outlined
                    :error-messages="errors"
                    label="Email"
                  />
                </ValidationProvider>

                <nuxt-link
                  to="/login"
                  class="mynuxtlink"
                >
                  Sign in instead
                </nuxt-link>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              class="mr-6 mt-n6 mb-6"
              @click="createAccount(invalid)"
            >
              Create account
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
      userName: '',
      userAddress: '',
      userTelephone: '',
      userEmail: '',
      showPwd: false,
      signupErr: null
    }
  },

  methods: {
    ...mapActions('auth', {
      signup: 'signup'
    }),

    async createAccount (formInvalid) {
      if (formInvalid) { return }

      try {
        const createAccResCode = await this.signup({
          userId: this.userId,
          userPwd: this.userPwd,
          userName: this.userName,
          userAddress: this.userAddress,
          userTelephone: this.userTelephone,
          userEmail: this.userEmail
        })

        if (createAccResCode === 1) {
          this.signupErr = 'This user account already exists, new account not created'
        } else if (createAccResCode === 0) {
          // this.signupErr = 'User account created' //for debugging purpose only
          this.$store.commit('auth/SET_SIGNUP_STATUS', 'User account created')
          this.$router.push('/login')
        }
      } catch (error) {
        // this.signupErr = error //this gives an unfriendly error msg
        this.signupErr = 'Unable to signup at the moment, please try again later'
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
