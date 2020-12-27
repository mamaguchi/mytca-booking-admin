<template>
  <v-app>
    <core-app-bar />
    <core-drawer />
    <core-view />
    <!-- <core-settings /> -->
  </v-app>
</template>

<script>
import AppBar from '@/components/core/AppBar'
import Drawer from '@/components/core/Drawer'
import View from '@/components/core/View'
// import Settings from '@/components/core/Settings'

export default {
  components: {
    CoreAppBar: AppBar,
    CoreDrawer: Drawer,
    CoreView: View
    // CoreSettings: Settings
  },

  data: () => ({
    // drawer: null,
    expandOnHover: false
  })
}
</script>

<style>

body > div {
    display: none;
}

body > footer#dashboard-core-footer {
    display: none;
}

body > div#__nuxt {
    display: block;
}

</style>
