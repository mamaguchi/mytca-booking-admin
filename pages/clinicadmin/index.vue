<template>
  <v-container
    fluid
  >
    <!-- ====================  -->
    <!-- CLINIC INFO SECTION  -->
    <!-- ====================  -->
    <adv-clinic-info />

    <!-- ====================  -->
    <!-- DEPT LIST SECTION  -->
    <!-- ====================  -->
    <v-divider class="mt-14" />
    <div class="text-center text-h4 mt-6 mb-n4">
      Department
    </div>
    <v-row justify="center">
      <v-col cols="10">
        <adv-dept-info />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ClinicInfo from '@/components/adv/ClinicInfo'
import DeptInfo from '@/components/adv/DeptInfo'
import { mapMutations } from 'vuex'

export default {

  components: {
    AdvClinicInfo: ClinicInfo,
    AdvDeptInfo: DeptInfo
  },

  middleware: ['token'],

  fetch () {
    this.setUserId('880601105150')
    this.setUserPwd('88motherfaker88')
    this.setState('pahang')
    this.setDistrict('maran')
    this.setClinicId('kk_maran')
  },

  methods: {
    ...mapMutations('admin', {
      setUserId: 'setUserId',
      setUserPwd: 'setUserPwd',
      setState: 'setState',
      setDistrict: 'setDistrict',
      setClinicId: 'setClinicId'
    })
  }

}

</script>
