import colors from 'vuetify/es5/util/colors'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - mytca',
    title: 'mytca',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/variables.scss'],

  // Style Resources
  styleResources: {
    scss: ['@/assets/*.scss']
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/chartist.js',
    '~/plugins/vee-validate'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-i18n',
    '@nuxtjs/style-resources',
  ],

  // i18n
  i18n: {
    lazy: true,
    locales: [
      { name: 'English', code: 'en', iso: 'en-US', file: 'en.js' },
    ],
    langDir: 'locales/',
    defaultLocale: 'en',
    loadLanguagesAsync: true,
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: true,
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3
      //   }
      // }
      primary: '#9652ff',
      success: '#3cd1c2',
      info: '#ffaa2c',
      error: '#f83e70'
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [
      "vee-validate/dist/rules",
      "vuetify/lib/mixins",
      "vuetify/lib/components/VCard"
    ],
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/,
            options: {
              fix: true
            }
          })
        }
    }
  }
}
