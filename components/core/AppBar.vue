<template>
  <v-app-bar
    id="app-bar"
    app
    hide-on-scroll
    color="teal lighten-1"
    height="75"
    class="elevation-1"
  >
    <v-btn
      class="mr-3"
      text
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon
        v-else
        color="white"
      >
        mdi-menu
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-regular"
    >
      <span style="cursor: pointer" class="white--text"><nuxt-link to="/clinicadmin" tag="span">myTCA</nuxt-link></span>
      <!-- <span class="blue--text text--lighten-1">m</span><span class="blue--text text--lighten-2">y</span><span class="blue--text text--lighten-1">TCA</span> -->
    </v-toolbar-title>

    <v-spacer />

    <v-btn
      v-if="isAuthenticated"
      class="ml-2"
      min-width="0"
      text
      @click="signOut"
    >
      <span class="white--text">Logout</span>
      <v-icon
        color="white"
        class="ml-1"
      >
        mdi-logout-variant
      </v-icon>
    </v-btn>

    <v-btn
      v-else
      class="ml-2"
      min-width="0"
      text
      to="/login"
    >
      <span class="white--text">Login</span>
      <v-icon
        color="white"
        class="ml-1"
      >
        mdi-login-variant
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
// Components
// import { VHover, VListItem } from 'vuetify/lib'

// Utilities
import { mapState, mapMutations, mapActions } from 'vuex'

export default {

  name: 'AppBar',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      // isAuthenticated: false
    }
  },

  computed: {
    ...mapState(['drawer']),

    isAuthenticated () {
      if (this.$store.state.auth.auth === null || !this.$store.state.auth.auth.token) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER'
    }),

    ...mapActions('auth', {
      logout: 'logout'
    }),

    signOut () {
      try {
        this.logout()
        this.$router.push('/login')
      } catch (error) {
        // const errorData = error //this gives an unfriendly error msg
        this.$router.push('/login')
      }
    }

  }
}
</script>
