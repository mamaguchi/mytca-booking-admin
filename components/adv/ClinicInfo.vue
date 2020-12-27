<template>
  <div>
    <ValidationObserver ref="clinicValidObserver" v-slot="{ dirty, invalid }">
      <base-material-card
        color="info"
        max-width="640"
        rounded
        class="v-card--material-chart mt-10 mx-auto rounded-lg"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template v-slot:heading>
          <div class="display-2 font-weight-light">
            <v-icon
              large
              left
            >
              mdi-hospital-building
            </v-icon>
            Clinic Overview
          </div>
        </template>

        <v-card-text class="font-weight-medium grey--text text--darken-4">
          <v-row no-gutters class="mx-auto">
            <v-col cols="10" class="text-left mt-4 ml-5">
              <ValidationProvider v-slot="{ errors }" rules="required|min:1">
                <v-text-field
                  v-model="clinicName"
                  label="Clinic Name"
                  :error-messages="errors"
                  clear-icon="mdi-close-circle-outline"
                  disabled
                />
              </ValidationProvider>
            </v-col>

            <v-col cols="5" class="text-left ml-5">
              <ValidationProvider v-slot="{ errors }" rules="required|min:1">
                <v-text-field
                  v-model="clinicState"
                  label="State"
                  :error-messages="errors"
                  clear-icon="mdi-close-circle-outline"
                />
              </ValidationProvider>
            </v-col>

            <v-col cols="5" class="text-left ml-5">
              <ValidationProvider v-slot="{ errors }" rules="required|min:1">
                <v-text-field
                  v-model="clinicDistrict"
                  label="District"
                  :error-messages="errors"
                  clear-icon="mdi-close-circle-outline"
                />
              </ValidationProvider>
            </v-col>
          </v-row>

          <!--  CLINIC-CLOSE-DAYS  -->
          <ValidationProvider>
            <v-row no-gutters class="mx-auto">
              <v-col cols="10" class="text-left ml-5 mt-2">
                <label>Clinic is close on</label>
                <v-treeview
                  v-model="clinicCloseDays"
                  dense
                  selectable
                  :items="daysOfWeek"
                  class="grey--text text--darken-1 ml-16 pl-16 mt-2"
                />
              </v-col>
            </v-row>
          </ValidationProvider>

          <!--  CLINIC-PUBLIC-HOLIDAY  -->
          <ValidationProvider>
            <v-row no-gutters class="mx-auto">
              <v-col cols="10" class="d-flex flex-column text-left ml-5 mt-2">
                <label>Public holiday</label>
                <v-date-picker
                  v-model="clinicPubHol"
                  class="mt-1 ml-12"
                  no-title
                  multiple
                  :allowed-dates="checkAllowedDates"
                  :show-current="false"
                  @click:date="dateClick"
                />
              </v-col>
            </v-row>
          </ValidationProvider>

          <!--  CLINIC-STAFF  -->
          <v-form
            v-model="addNewStaffInputValid"
          >
            <v-row
              class="pa-4"
              justify="space-between"
            >
              <v-col cols="5" class="d-flex flex-column">
                <label>Register new staff</label>

                <v-text-field
                  v-model="newStaffName"
                  class="mt-2"
                  label="Name"
                  outlined
                  flat
                  clearable
                  :rules="nameRules"
                  @click="newStaffStatusHint=''"
                  @click:clear="newStaffStatusHint=''"
                />

                <v-text-field
                  v-model="newStaffId"
                  class="mt-n10"
                  label="ID/IC number"
                  outlined
                  flat
                  clearable
                  :rules="idRules"
                  persistent-hint
                  :hint="newStaffStatusHint"
                  @click="newStaffStatusHint=''"
                  @click:clear="newStaffStatusHint=''"
                />

                <v-spacer />

                <v-row justify="center" align="end">
                  <v-btn
                    :disabled="!addNewStaffInputValid"
                    class="font-weight-medium grey--text text--darken-2"
                    @click="addStaffToClinic"
                  >
                    <v-icon left>
                      mdi-account-plus
                    </v-icon>
                    Register
                  </v-btn>
                </v-row>
              </v-col>

              <v-divider vertical />

              <!--  CLINIC-STAFF--CONTEXT-VIEW  -->
              <v-col>
                <label class="ml-4">Existing staff</label>

                <v-text-field
                  v-model="searchClinicStaffToDel"
                  class="mt-2 ml-4"
                  label="Filter"
                  outlined
                  flat
                  hide-details
                  clearable
                />

                <v-virtual-scroll
                  :items="clinicStaff"
                  :item-height="clinicStaffLength*70"
                  height="250"
                  class="ml-n2 mt-2"
                >
                  <template v-slot="{ item }">
                    <v-list-item>
                      <v-list-item-content>
                        <v-treeview
                          v-model="clinicStaffToDel"
                          :open="[0]"
                          :items="item"
                          activatable
                          :active.sync="activeClinicStaff"
                          selectable
                          :search="searchClinicStaffToDel"
                          dense
                          transition
                          class="grey--text text--darken-1"
                        >
                          <!-- eslint-disable-next-line  -->
                          <template v-slot:prepend="{ item }">
                            <v-icon v-if="!item.children">
                              mdi-account
                            </v-icon>
                          </template>
                        </v-treeview>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-virtual-scroll>

                <v-row justify="center">
                  <v-btn
                    :disabled="clinicStaffToDel.length === 0"
                    class="font-weight-medium grey--text text--darken-2 mt-5"
                    @click="delStaffFrmClinic"
                  >
                    <v-icon left>
                      mdi-delete
                    </v-icon>
                    Delete
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <template v-slot:actions>
          <v-row no-gutters justify="center">
            <v-btn
              :disabled="!clinicHasAddedStaff &&
                !clinicHasDeletedStaff &&
                (!dirty || invalid)"
              text
              class="font-weight-medium grey--text text--darken-2 mt-n1 mb-n2"
              @click="saveClinicDataToDirectory"
            >
              <v-icon left>
                mdi-content-save
              </v-icon>
              Save
            </v-btn>
          </v-row>
        </template>
      </base-material-card>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import MaterialCard from '@/components/base/MaterialCard'

export default {
  name: 'ClinicInfo',

  components: {
    ValidationObserver,
    ValidationProvider,
    BaseMaterialCard: MaterialCard
  },

  data () {
    return {
      addNewStaffInputValid: false,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      idRules: [
        v => !!v || 'ID is required'
      ],
      userId: '880601105150',
      userPwd: '88motherfaker88',
      clinicId: 'kk_maran',
      curYear: new Date().getFullYear(),
      daysOfWeek: [
        {
          id: 0,
          name: 'Sunday'
        },
        {
          id: 1,
          name: 'Monday'
        },
        {
          id: 2,
          name: 'Tuesday'
        },
        {
          id: 3,
          name: 'Wednesday'
        },
        {
          id: 4,
          name: 'Thursday'
        },
        {
          id: 5,
          name: 'Friday'
        },
        {
          id: 6,
          name: 'Saturday'
        }
      ]
    }
  },

  computed: {
    clinicName: {
      get () {
        return this.$store.getters['clinicadmin/getClinicName']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_NAME', newVal)
      }
    },
    clinicState: {
      get () {
        return this.$store.getters['clinicadmin/getClinicState']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_STATE', newVal)
      }
    },
    clinicDistrict: {
      get () {
        return this.$store.getters['clinicadmin/getClinicDistrict']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_DISTRICT', newVal)
      }
    },
    clinicCloseDays: {
      get () {
        return this.$store.getters['clinicadmin/getClinicCloseDays']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_CLOSE_DAYS', newVal)
      }
    },
    clinicPubHol: {
      get () {
        return this.$store.getters['clinicadmin/getClinicPubHol']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_PUB_HOL', newVal)
      }
    },
    newStaffName: {
      get () {
        return this.$store.getters['clinicadmin/getNewStaffName']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_NEW_STAFF_NAME', newVal)
      }
    },
    newStaffId: {
      get () {
        return this.$store.getters['clinicadmin/getNewStaffId']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_NEW_STAFF_ID', newVal)
      }
    },
    searchClinicStaffToDel: {
      get () {
        return this.$store.getters['clinicadmin/getSearchClinicStaffToDel']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_SEARCH_CLINIC_STAFF_TO_DEL', newVal)
      }
    },
    clinicStaff () {
      return this.$store.getters['clinicadmin/getClinicStaff']
    },
    clinicStaffLength () {
      return this.$store.getters['clinicadmin/getClinicStaffLength']
    },
    clinicStaffToDel: {
      get () {
        return this.$store.getters['clinicadmin/getClinicStaffToDel']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_STAFF_TO_DEL', newVal)
      }
    },
    activeClinicStaff: {
      get () {
        return this.$store.getters['clinicadmin/getActiveClinicStaff']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_ACTIVE_CLINIC_STAFF', newVal)
      }
    },
    clinicHasAddedStaff: {
      get () {
        return this.$store.getters['clinicadmin/getClinicHasAddedStaff']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_HAS_ADDED_STAFF', newVal)
      }
    },
    clinicHasDeletedStaff: {
      get () {
        return this.$store.getters['clinicadmin/getClinicHasDeletedStaff']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_HAS_DELETED_STAFF', newVal)
      }
    },
    newStaffStatusHint: {
      get () {
        return this.$store.getters['clinicadmin/getNewStaffStatusHint']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_NEW_STAFF_STATUS_HINT', newVal)
      }
    }
  },

  mounted () {
    if (this.$store.getters['clinicadmin/getDeptPanelToggleOpen'] === null) {
      this.$store.dispatch('clinicadmin/getClinicInfo')
        .then(result => this.$refs.clinicValidObserver.reset())
    }
  },

  methods: {
    addStaffToClinic () {
      this.$store.dispatch('clinicadmin/addStaffToClinic')
    },

    delStaffFrmClinic () {
      this.$store.dispatch('clinicadmin/delStaffFrmClinic')
    },

    // TODO: KIV to migrate this method and the methods it dependent
    //       on to Vuex actions when User authentication(ID and password)
    //       are integrated into Vuex store.
    saveClinicDataToDirectory () {
      const output = {}

      output.userId = this.userId
      output.userPwd = this.userPwd
      output.state = this.clinicState
      output.district = this.clinicDistrict
      output.clinicId = this.clinicId
      output.closeDays = this.processCloseDaysIntArrToStr(this.clinicCloseDays)
      output.publicHolidays = this.processPubHolNuxtToOpendjFormat(
        this.clinicPubHol,
        this.curYear)
      output.staffIds = this.processTreeViewToClinicStaffId()

      const data = JSON.stringify(output)

      this.$axios.post('http://localhost:8082/admin/updateclinic', data)
        .then((response) => {
          this.$refs.clinicValidObserver.reset()
          this.clinicHasAddedStaff = false
          this.clinicHasDeletedStaff = false
          alert('saveClinicDataToDirectory done successfully!')
        }, (response) => {
          alert('saveClinicDataToDirectory failed!')
        })
    },

    processCloseDaysIntArrToStr (closeDaysArr) {
      return closeDaysArr.map(val => val.toString()).join(',')
    },

    processPubHolNuxtToOpendjFormat (dates, curYear) {
      // Use the structure of Javascript Obj to
      // store the year and month value as its key recursively.
      // If year and month key is absent, then create it
      // by assigning it to '{}' empty object and '[]'
      // empty array respectively.
      // Month array is used to store the days.
      const res = {}
      dates.map((val) => {
        const tmp1 = val.split('-')
        if (parseInt(tmp1[0]) < curYear) {
          return
        }
        if (!res[tmp1[0]]) {
          res[tmp1[0]] = {}
        }
        if (!res[tmp1[0]][tmp1[1]] || res[tmp1[0]][tmp1[1]].length === 0) {
          res[tmp1[0]][tmp1[1]] = []
        }
        res[tmp1[0]][tmp1[1]].push(tmp1[2])
      })
      // Now access the years and months key in the
      // booking Javascript object by using 'Object.keys()' function.
      // Keys are returned as string.
      // Join the days string together, then put the year, month and days
      // string as element in an array.
      // Join the string elements in the array to produce the final desired
      // output format ['<year>:<month>:<comma-delimited-days>', [...]]
      // (e.g ['2020:03:02,04,06', '2020:10:01,10,15'])
      const res2 = []
      const yrs = Object.keys(res)
      for (let i = 0; i < yrs.length; i++) {
        const mths = Object.keys(res[yrs[i]])
        for (let j = 0; j < mths.length; j++) {
          const tmp2 = [yrs[i], mths[j], res[yrs[i]][mths[j]].join(',')]
          res2.push(tmp2.join(':'))
        }
      }
      return res2
    },

    processTreeViewToClinicStaffId () {
      const staffIds = this.clinicStaff[0][0].children

      return staffIds.map((val) => {
        const tmpArr = [val.name, val.id]
        return tmpArr.join(':')
      })
    },

    checkAllowedDates (dateStr) {
      const clinicPubHol = ['2020-10-05', '2020-10-07', '2020-10-03', '2020-10-09', '2020-09-02', '2020-09-04', '2020-09-06']
      const svcAvaiDays = [2, 4, 5, 6]
      if (clinicPubHol.includes(dateStr)) {
        return false
      } else {
        const date = new Date(dateStr)
        const dayOfWeek = date.getDay()
        if (!svcAvaiDays.includes(dayOfWeek)) {
          return false
        }
      }
      return true
    },

    dateClick (date) {
      // Do nothing for now
    }

  }
}

</script>
