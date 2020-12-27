<template>
  <!-- <v-main class="grey lighten-3"> -->
  <v-main class="grey lighten-4">
    <nuxt />

    <core-footer class="mb-n8" />
  </v-main>
</template>

<script>
import Footer from '@/components/core/Footer'

export default {
  name: 'DashboardCoreView',

  components: {
    CoreFooter: Footer
  }
}
</script>
