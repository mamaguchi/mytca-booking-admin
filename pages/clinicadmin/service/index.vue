<template>
  <v-container
    fluid
  >
    <h6>{{ userId }}</h6>
    <h6>{{ userPwd }}</h6>
    <h6>{{ clinicState }}</h6>
    <h6>{{ district }}</h6>
    <h6>{{ clinicId }}</h6>
    <h6>{{ deptName }}</h6>

    <h6>{{ deptAvaiDays }}</h6>
    <h6>{{ deptStartHrs }}</h6>
    <h6>{{ deptStartHrsAMPM }}</h6>
    <h6>{{ deptEndHrs }}</h6>
    <h6>{{ deptEndHrsAMPM }}</h6>

    <h2>{{ clinicDeptUnderConfig }}</h2>
    <h2>{{ clinicId }}</h2>

    <!-- <h6>{{ hello }}</h6> -->

    <v-row justify="center">
      <v-col cols="10">
        <keep-alive>
          <v-expansion-panels v-model="svcPanelToggleOpen" focusable class="mt-10" max-width="600">
            <v-expansion-panel
              v-for="(service,idx) in services"
              :key="service.name"
              class="mb-4"
              @click.native.capture="servicePanelClicked(service,
                                                         $event)"
            >
              <v-expansion-panel-header
                color="success"
                class="py-1"
              >
                <template v-slot:actions>
                  <v-icon v-if="service.isEnabled" color="white">
                    mdi-menu-down-outline
                  </v-icon>
                  <v-icon v-else disabled>
                    mdi-menu-down-outline
                  </v-icon>
                </template>
                <v-row align="center" class="ml-2 mr-4">
                  <span class="title font-weight-regular">
                    <v-icon
                      left
                      color="white"
                    >
                      mdi-doctor
                    </v-icon>
                    <span class="white--text headline">
                      {{ service.name.toUpperCase() }}
                    </span>

                  </span>

                  <v-spacer />

                  <v-btn
                    :class="service.isEnabled? 'green--text':'grey--text text--darken-3'"
                    :color="service.isEnabled? 'white':'grey'"
                    @click.stop="servicePanelToggleEnable(service)"
                  >
                    Enable
                  </v-btn>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ValidationObserver ref="svcValidObserver" v-slot="{ dirty, invalid, reset }">
                  <v-card
                    flat
                    rounded
                    class="rounded-lg"
                  >
                    <v-card-text class="font-weight-medium grey--text text--darken-4">
                      <!--  AVAILABLE-DAYS  -->
                      <v-row
                        class="pa-4"
                        justify="space-between"
                      >
                        <v-col cols="5">
                          <label>{{ service.name.toUpperCase() }} service is available on</label>
                          <!-- <ValidationProvider v-slot="{ dirty }"> -->
                          <v-treeview
                            v-model="service.availability.avaiDays"
                            class="grey--text text--darken-1"
                            :items="daysOfWeek"
                            dense
                            selectable
                            open-on-click
                            transition
                            activatable
                            :active.sync="service.activeAvaiDays"
                            color="blue"
                            @input="checkServiceAvailability(
                              idx,
                              service.availability,
                              service.hasSelectedNewDay,
                              service
                            )"
                            @update:active="updateAvaiDaysContxtView(
                              idx, $event
                            )"
                          />
                        </v-col>

                        <v-divider vertical />

                        <!--  AVAILABLE-DAYS--CONTEXT-VIEW  -->
                        <v-col
                          class="d-flex text-center"
                        >
                          <v-scroll-y-transition mode="out-in">
                            <v-card
                              class="pt-6 mx-auto"
                              flat
                              max-width="400"
                            >
                              <v-card-text>
                                <div v-if="service.activeAvaiDays.length===0" class="mt-16 pt-6">
                                  <v-row justify="center" align="center">
                                    <v-col cols="10">
                                      <span class="title">
                                        <v-icon
                                          large
                                          left
                                        >
                                          mdi-arrow-left
                                        </v-icon>
                                        Select A Day
                                      </span>
                                    </v-col>
                                    <v-col cols="10">
                                      <span class="text-caption ml-8">
                                        by clicking on the name of day
                                      </span>
                                    </v-col>
                                  </v-row>
                                </div>

                                <div
                                  v-else-if="service.avaiDaysContxtView.isClosed &&
                                    service.activeAvaiDays.length!==0"
                                  class="mt-16 pt-6"
                                >
                                  <v-row justify="center" align="center">
                                    <v-col cols="10">
                                      <span class="title">
                                        <v-icon
                                          large
                                        >
                                          mdi-domain-off
                                        </v-icon>
                                        <pre class="title">Sorry, department is closed on {{ idxToDayOfWeek(idx) }}!</pre>
                                      </span>
                                    </v-col>
                                  </v-row>
                                </div>

                                <div
                                  v-else-if="!service.avaiDaysContxtView.isAvailable &&
                                    service.activeAvaiDays.length!==0"
                                  class="mt-16 pt-6"
                                >
                                  <v-row justify="center" align="center">
                                    <v-col cols="10">
                                      <span class="title">
                                        <v-icon
                                          large
                                        >
                                          mdi-sticker-check-outline
                                        </v-icon>
                                        <div class="title">Check the tickbox to activate {{ service.name }} service on {{ idxToDayOfWeek(idx) }}</div>
                                      </span>
                                    </v-col>
                                  </v-row>
                                </div>

                                <div v-else class="mt-n12">
                                  <span class="title">
                                    Adjust Operating Hours
                                  </span>

                                  <v-divider class="mb-2" />

                                  <span class="text-overline text-darken-4 pt-10">
                                    <strong>{{ idxToDayOfWeek(idx) }}</strong>
                                  </span>

                                  <v-row
                                    class="text-left mt-n6"
                                    tag="v-card-text"
                                  >
                                    <v-col class="text-center mr-4 mt-16" tag="strong" cols="5">
                                      <span>Start Hour</span>
                                      <ValidationProvider>
                                        <v-btn-toggle
                                          v-model="service.availability.startHoursAMPM[service.activeAvaiDays[0]]"
                                          mandatory
                                          tile
                                          color="blue"
                                          group
                                        >
                                          <v-btn :disabled="deptStartHrsAMPM[service.activeAvaiDays]==='pm'" value="am">
                                            AM
                                          </v-btn>
                                          <v-btn :disabled="deptEndHrsAMPM[service.activeAvaiDays]==='am'" value="pm">
                                            PM
                                          </v-btn>
                                        </v-btn-toggle>
                                      </ValidationProvider>
                                    </v-col>
                                    <v-col cols="5">
                                      <v-container>
                                        <ValidationProvider>
                                          <v-picker width="160">
                                            <v-time-picker-clock
                                              v-model="service.availability.startHours[service.activeAvaiDays[0]]"
                                              :allowed-values="allowedStartHrs"
                                              :min="1"
                                              :max="12"
                                              :rotate="30"
                                            >
                                              <div />
                                            </v-time-picker-clock>
                                          </v-picker>
                                        </ValidationProvider>
                                      </v-container>
                                    </v-col>

                                    <v-col class="text-center mr-4 mt-16" tag="strong" cols="5">
                                      <span>End Hour</span>
                                      <ValidationProvider>
                                        <v-btn-toggle
                                          v-model="service.availability.endHoursAMPM[service.activeAvaiDays[0]]"
                                          tile
                                          color="blue"
                                          group
                                        >
                                          <v-btn :disabled="deptStartHrsAMPM[service.activeAvaiDays]==='pm'" value="am">
                                            AM
                                          </v-btn>
                                          <v-btn :disabled="deptEndHrsAMPM[service.activeAvaiDays]==='am'" value="pm">
                                            PM
                                          </v-btn>
                                        </v-btn-toggle>
                                      </ValidationProvider>
                                    </v-col>
                                    <v-col cols="5">
                                      <v-container>
                                        <ValidationProvider>
                                          <v-picker width="160">
                                            <v-time-picker-clock
                                              v-model="service.availability.endHours[service.activeAvaiDays[0]]"
                                              :allowed-values="allowedEndHrs"
                                              :min="1"
                                              :max="12"
                                              :rotate="30"
                                            >
                                              <div />
                                            </v-time-picker-clock>
                                          </v-picker>
                                        </ValidationProvider>
                                      </v-container>
                                    </v-col>
                                  </v-row>
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-scroll-y-transition>
                        </v-col>
                      </v-row>

                      <v-row no-gutters>
                        <v-col cols="20">
                          <v-divider />
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <!--  SAVE  -->
                    <v-card-actions>
                      <v-row no-gutters justify="center">
                        <v-btn
                          text
                          :disabled="!service.hasSelectedNewDay.isDirty &&
                            (!dirty || invalid)"
                          class="font-weight-medium grey--text text--darken-2 mt-n5 mb-n5"
                          @click="saveSvcDataToDirectory(idx, service.name, reset)"
                        >
                          <v-icon left>
                            mdi-content-save
                          </v-icon>
                          Save
                        </v-btn>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </ValidationObserver>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </keep-alive>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as SvcConsts from '@/utils/constants/mytca_booking/SvcConsts'
import * as AdmPgFuncs from '@/utils/functions/AdminPageFuncs'
import * as Sets from '@/utils/functions/math/Sets'
import { mapState } from 'vuex'

export default {

  components: {
    ValidationObserver,
    ValidationProvider
  },

  // [ALTERNATIVE TO USING 'asyncData']
  // async middleware (context) {

  //   const userId = context.store.state.admin.userId
  //   const userPwd = context.store.state.admin.userPwd
  //   const deptName = context.store.state.admin.deptName
  //   const clinicId = context.store.state.admin.clinicId
  //   const district = context.store.state.admin.district
  //   const state = context.store.state.admin.clinicState

  //   let clinicSvcBasicDetailsApi = 'http://localhost:8082/admin/clinicsvcbscdetails'
  //   const queryStr = `?userId=${userId}&userPwd=${userPwd}&deptName=${deptName}&clinicId=${clinicId}&district=${district}&state=${state}`
  //   clinicSvcBasicDetailsApi = clinicSvcBasicDetailsApi + queryStr
  //   const { data } = await context.$axios.post(clinicSvcBasicDetailsApi)

  //   const svcs = []

  //   // LOAD SERVICE BASIC DATA OBTAINED FROM DIRECTORY
  //   const serviceBasicDetailsLst = data.serviceBasicDetailsLst
  //   serviceBasicDetailsLst.map((val) => {
  //     const svcObj = {}
  //     svcObj.name = val.name
  //     const boolVal = !!val.isEnabled
  //     svcObj.isEnabled = boolVal
  //     svcObj.isBasicDataLoaded = true
  //     svcObj.isAdvDataLoaded = false
  //     svcObj.isDirty = false
  //     svcs.push(svcObj)
  //   })

  //   // INITIALIZE REMAINING UNACTIVATED SERVICE WITH DEFAULT VALUE
  //   const svcsCpy = [...svcs]
  //   for (let m = 0; m < SvcConsts.SVC_ALL.length; m++) {
  //     let svcPresent = false
  //     const svcName = SvcConsts.SVC_ALL[m]
  //     for (let n = 0; n < svcsCpy.length; n++) {
  //       if (svcsCpy[n].name === svcName) {
  //         svcPresent = true
  //         break
  //       }
  //     }
  //     if (!svcPresent) {
  //       const svcObj = {}
  //       svcObj.name = svcName
  //       svcObj.isEnabled = false
  //       svcObj.isBasicDataLoaded = false
  //       svcObj.isAdvDataLoaded = false
  //       svcObj.isDirty = false
  //       svcs.push(svcObj)
  //     }
  //   }

  //   // INITIALIZE OTHER PROPERTIES OF ALL svc OBJECT IN 'svcs'
  //   for (let i = 0; i < svcs.length; i++) {
  //     // SERVICE OPERATIONAL AVAILABILITY
  //     svcs[i].isPanelFirstLoad = true
  //     svcs[i].hasSelectedNewDay = { sw: false, isDirty: false }
  //     svcs[i].activeAvaiDays = []
  //     svcs[i].avaiDaysContxtView = {
  //       isClosed: false,
  //       isAvailable: false
  //     }
  //     // MISC
  //     svcs[i].availability = AdmPgFuncs.processOperatingDaysAndHours('', '', '')
  //   }

  //   context.store.commit('admin/setServices', svcs)
  // },

  async asyncData (context) {
    const userId = context.store.state.admin.userId
    const userPwd = context.store.state.admin.userPwd
    const deptName = context.store.state.admin.deptName
    const clinicId = context.store.state.admin.clinicId
    const district = context.store.state.admin.district
    const state = context.store.state.admin.clinicState

    let clinicSvcBasicDetailsApi = 'http://localhost:8082/admin/clinicsvcbscdetails'
    const queryStr = `?userId=${userId}&userPwd=${userPwd}&deptName=${deptName}&clinicId=${clinicId}&district=${district}&state=${state}`
    clinicSvcBasicDetailsApi = clinicSvcBasicDetailsApi + queryStr
    const { data } = await context.$axios.post(clinicSvcBasicDetailsApi)

    const svcs = []

    // LOAD SERVICE BASIC DATA OBTAINED FROM DIRECTORY
    const serviceBasicDetailsLst = data.serviceBasicDetailsLst
    serviceBasicDetailsLst.map((val) => {
      const svcObj = {}
      svcObj.name = val.name
      const boolVal = !!val.isEnabled
      svcObj.isEnabled = boolVal
      svcObj.isBasicDataLoaded = true
      svcObj.isAdvDataLoaded = false
      svcObj.isDirty = false
      svcs.push(svcObj)
    })

    // INITIALIZE REMAINING UNACTIVATED SERVICE WITH DEFAULT VALUE
    const svcsCpy = [...svcs]
    for (let m = 0; m < SvcConsts.SVC_ALL.length; m++) {
      let svcPresent = false
      const svcName = SvcConsts.SVC_ALL[m]
      for (let n = 0; n < svcsCpy.length; n++) {
        if (svcsCpy[n].name === svcName) {
          svcPresent = true
          break
        }
      }
      if (!svcPresent) {
        const svcObj = {}
        svcObj.name = svcName
        svcObj.isEnabled = false
        svcObj.isBasicDataLoaded = false
        svcObj.isAdvDataLoaded = false
        svcObj.isDirty = false
        svcs.push(svcObj)
      }
    }

    // INITIALIZE OTHER PROPERTIES OF ALL svc OBJECT IN 'svcs'
    for (let i = 0; i < svcs.length; i++) {
      // SERVICE OPERATIONAL AVAILABILITY
      svcs[i].isPanelFirstLoad = true
      svcs[i].hasSelectedNewDay = { sw: false, isDirty: false }
      svcs[i].activeAvaiDays = []
      svcs[i].avaiDaysContxtView = {
        isClosed: false,
        isAvailable: false
      }
      // MISC
      svcs[i].availability = AdmPgFuncs.processOperatingDaysAndHours('', '', '')
    }

    // OPTIONAL: To store services as local variables
    //           instead of storing it in Vuex store.
    // return {
    //   services: svcs
    // }
    context.store.commit('admin/setServices', svcs)
  },

  data () {
    return {
      svcPanelToggleOpen: null,
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
    ...mapState('admin', {
      services (state) {
        return state.services
      },

      userId (state) {
        return state.userId
      },

      userPwd (state) {
        return state.userPwd
      },

      clinicState (state) {
        return state.clinicState
      },

      district (state) {
        return state.district
      },

      clinicId (state) {
        return state.clinicId
      },

      deptName (state) {
        return state.deptName
      },

      deptAvaiDays (state) {
        return state.deptAvaiDays
      },

      deptStartHrs (state) {
        return state.deptStartHrs
      },

      deptStartHrsAMPM (state) {
        return state.deptStartHrsAMPM
      },

      deptEndHrs (state) {
        return state.deptEndHrs
      },

      deptEndHrsAMPM (state) {
        return state.deptEndHrsAMPM
      },

      deptAvailability (state) {
        return state.deptAvailability
      }
    }),

    clinicDeptUnderConfig () {
      return this.$store.getters['clinicadmin/getClinicDeptUnderConfig']
    },

    clinicId () {
      return this.$store.getters['clinicadmin/getClinicName']
    }
  },

  watch: {
    // Different DeptPanel interaction scenarios,
    // when clicking the panel expand button:
    // 1) IsBasicDataNotLoaded, Absent
    //    - [Implemented in SaveButton func]
    //    - Client app need to create a new dept. No SearchRequest needed.
    //    - When user click SaveButton, client app send the new dept data
    //      to websvc.
    //    - Websvc send AddRequest to save new dept data to directory.
    // 2) IsBasicDataLoaded, Present, IsAdvDataNotLoaded, IsNotDirty
    //    - [Implemented in THIS func]
    //    - Client app send a req to websvc.
    //    - Websvc send a SearchRequest to directory, get the
    //      dept AdvData, then send it back to client app.
    // 3) IsBasicDataLoaded, Present, IsAdvDataNotLoaded, IsDirty
    //    - [Implemented in THIS func]
    //    - Client app send a req and IsEnabled data to websvc.
    //    - Websvc send ModifyRequest to update IsEnabled data
    //      to directory.
    //    - Websvc then send a SearchRequest to directory, get the
    //      dept AdvData, then send it back to client app.
    // 4) IsBasicDataLoaded, Present, IsAdvDataLoaded, IsNotDirty
    //    - [Not implemented]
    //    - Client app does nothing.
    // 5) IsBasicDataLoaded, Present, IsAdvDataLoaded, IsDirty
    //    - [Implemented in SaveButton func]
    //    - Client app waits for user's action to save data.
    //    - When user click SaveButton, client app send dept data
    //      to websvc.
    //    - Websvc send ModifyRequest to save dept data to directory.
    async svcPanelToggleOpen (idx) {
      if (idx !== null && idx !== undefined) {
        if (this.services[idx].isBasicDataLoaded &&
            !this.services[idx].isAdvDataLoaded) {
          // LOAD DEPT ADVANCED DATA
          const userId = this.userId
          const userPwd = this.userPwd
          const deptName = this.deptName
          const svcName = this.services[idx].name
          const clinicId = this.clinicId
          const district = this.district
          const state = this.clinicState
          const isDirty = this.services[idx].isDirty
          const isEnabled = this.services[idx].isEnabled

          let clinicSvcAdvDetailsApi = 'http://localhost:8082/admin/clinicsvcadvdetails'
          const queryStr = `?isDirty=${isDirty}&isEnabled=${isEnabled}&userId=${userId}&userPwd=${userPwd}&svcName=${svcName}&deptName=${deptName}&clinicId=${clinicId}&district=${district}&state=${state}`
          clinicSvcAdvDetailsApi = clinicSvcAdvDetailsApi + queryStr
          const { data } = await this.$axios.post(clinicSvcAdvDetailsApi)

          // TODO: Add a spinning icon here and retry
          //       $axios.post(clinicDeptDetailsApi) again if data is null/undefined
          this.services[idx].availability = AdmPgFuncs.processOperatingDaysAndHours(
            data.avaiDays,
            data.startHrs,
            data.endHrs
          )
          this.services[idx].isAdvDataLoaded = true
        }

        if (this.services[idx].availability.avaiDays.length === 0) {
          this.services[idx].isPanelFirstLoad = false
        }
      }
    }
  },

  methods: {
    servicePanelClicked (svc, event) {
      if (event.target.textContent.length === 42) {
        // 42 is the textContent length for "Enable" text
        // of 'servicePanelToggleEnable' button
        return
      }
      if (svc.isEnabled) {
        return
      }
      event.stopPropagation()
    },

    servicePanelToggleEnable (svc) {
      svc.isEnabled = !svc.isEnabled
      if (!svc.isEnabled) {
        this.svcPanelToggleOpen = null
      }
      this.toggleSvcAvaiToDirectory(svc.isEnabled, svc.name)
      svc.isDirty = true
    },

    checkServiceAvailability (idx, serviceAvailability, hasSelectedNewDay, svc) {
      // This block is to prevent this
      // function from executing twice, triggered
      // reactively when we removed the forbidden
      // day from 'serviceAvailability.avaiDays'.
      if (hasSelectedNewDay.sw) {
        hasSelectedNewDay.sw = false
        return
      }

      // This block of code updates the AvaiDaysContxtView
      // when a user check/uncheck the treeview checkbox option.
      let hasModifyTreeviewOpt = false
      if (svc.isPanelFirstLoad) {
        svc.isPanelFirstLoad = false
      } else {
        const newlyCheckedOpt = Sets.leftSymDiff(serviceAvailability.avaiDays, serviceAvailability.prevAvaiDays)
        if (newlyCheckedOpt.length !== 0) {
          // We have checked a treeview option
          svc.activeAvaiDays = newlyCheckedOpt
          this.updateAvaiDaysContxtView(idx, svc.activeAvaiDays[0])
        } else {
          // To check whether we have unchecked a treeview option
          const newlyUncheckedOpt = Sets.leftSymDiff(serviceAvailability.prevAvaiDays, serviceAvailability.avaiDays)
          if (newlyUncheckedOpt[0] === svc.activeAvaiDays[0]) {
            // We have unchecked an active treeview option
            this.updateAvaiDaysContxtView(idx, svc.activeAvaiDays[0])
          }
        }
        hasModifyTreeviewOpt = true
      }

      // This block of code checks whether the currently
      // checked treeview options are allowed by deptAvaiDays.
      // If not allowed, the option will be unchecked programatically.
      const tmpArr = [...serviceAvailability.avaiDays]
      serviceAvailability.avaiDays = Sets.intersection(tmpArr, this.deptAvaiDays)
      serviceAvailability.prevAvaiDays = serviceAvailability.avaiDays
      const symDiffRes = Sets.symDiff(serviceAvailability.avaiDays, tmpArr)
      if (symDiffRes.length !== 0) { /* we have pick a new day but forbidden, and got removed from serviceAvailability.avaiDays */
        hasSelectedNewDay.sw = true
      } else { /* we have pick a new day and allowed */
        // eslint-disable-next-line
        if (hasModifyTreeviewOpt) {
          hasSelectedNewDay.isDirty = true
        }
      }
    },

    updateAvaiDaysContxtView (idx, eventSelectedDay) {
      const contxtView = this.services[idx].avaiDaysContxtView

      if (!this.deptAvaiDays.includes(parseInt(eventSelectedDay))) {
        contxtView.isClosed = true
      } else {
        if (this.services[idx].availability.avaiDays.includes(parseInt(eventSelectedDay))) {
          contxtView.isAvailable = true
        } else {
          contxtView.isAvailable = false
        }
        contxtView.isClosed = false
      }
    },

    idxToDayOfWeek (idx) {
      const activeAvaiDay = this.services[idx].activeAvaiDays[0]
      return this.daysOfWeek[activeAvaiDay].name
    },

    allowedStartHrs (val) {
      const activeSvcIdx = this.svcPanelToggleOpen
      if (activeSvcIdx !== null && activeSvcIdx !== undefined) {
        const activeAvaiDay = this.services[activeSvcIdx].activeAvaiDays[0]

        if (this.services[activeSvcIdx].availability.startHoursAMPM[activeAvaiDay] === 'am') {
          return val >= this.deptStartHrs[this.services[activeSvcIdx].activeAvaiDays[0]]
        } else if (this.services[activeSvcIdx].availability.startHoursAMPM[activeAvaiDay] === 'pm') {
          return val <= this.deptEndHrs[this.services[activeSvcIdx].activeAvaiDays[0]]
        }
      }
    },

    allowedEndHrs (val) {
      const activeSvcIdx = this.svcPanelToggleOpen
      if (activeSvcIdx !== null && activeSvcIdx !== undefined) {
        const activeAvaiDay = this.services[activeSvcIdx].activeAvaiDays[0]

        if (this.services[activeSvcIdx].availability.endHoursAMPM[activeAvaiDay] === 'pm') {
          return val <= this.deptEndHrs[this.services[activeSvcIdx].activeAvaiDays[0]]
        } else if (this.services[activeSvcIdx].availability.endHoursAMPM[activeAvaiDay] === 'am') {
          return val >= this.deptStartHrs[this.services[activeSvcIdx].activeAvaiDays[0]]
        }
      }
    },

    toggleSvcAvaiToDirectory (isEnabled, svcName) {
      const output = {}

      output.userId = '880601105150'
      output.userPwd = '88motherfaker88'
      output.state = 'pahang'
      output.district = 'maran'
      output.clinicId = this.clinicId
      output.deptName = this.clinicDeptUnderConfig
      output.svcName = svcName
      output.svcIsEnabled = isEnabled ? '1' : '0'

      const data = JSON.stringify(output)

      this.$axios.post('http://localhost:8082/admin/togglesvcavai', data)
        .then((response) => {
          alert('Service availability toggled successfully to: ' +
                    output.svcIsEnabled)
        }, (response) => {
          alert('Service availability toggle failed!')
        })
    },

    saveSvcDataToDirectory (idx, svcName, reset) {
      const output = {}

      output.userId = '880601105150'
      output.userPwd = '88motherfaker88'
      output.state = 'pahang'
      output.district = 'maran'
      output.clinicId = 'kk_maran'
      output.deptName = 'opd_disease'
      output.svcName = svcName
      output.svcIsEnabled = this.services[idx].isEnabled ? '1' : '0'
      output.svcAvaiDays = this.processOperatingDays(idx)

      const startHrsOutput = this.processOperatingStartHours(idx)
      if (startHrsOutput === '') {
        alert('Invalid service start hour! Service data not saved.')
        return
      }
      output.svcStartHrs = startHrsOutput

      const endHrsOutput = this.processOperatingEndHours(idx)
      if (endHrsOutput === '') {
        alert('Invalid service end hour! Service data not saved.')
        return
      }
      output.svcEndHrs = endHrsOutput

      const data = JSON.stringify(output)

      if (this.services[idx].isBasicDataLoaded) {
        // UPDATE DEPT
        this.$axios.post('http://localhost:8082/admin/updatesvc', data)
          .then((response) => {
            alert('Service data updated successfully!')
            reset() // reverts the ValidationObserver states(flags) back to their initial state.
            this.services[idx].hasSelectedNewDay.isDirty = false
          }, (response) => {
            alert('Service data update failed!')
          })
      } else {
        // ADD A NEW DEPT
        this.$axios.post('http://localhost:8082/admin/addsvc', data)
          .then((response) => {
            alert('New service added successfully!')
            this.services[idx].isBasicDataLoaded = true
            reset() // reverts the ValidationObserver states(flags) back to their initial state.
            this.services[idx].hasSelectedNewDay.isDirty = false
          }, (response) => {
            alert('New service add failed!')
          })
      }
    },

    processOperatingDays (idx) {
      const tmpAvaiDays = ['0', '0', '0', '0', '0', '0', '0']
      const avaiDays = this.services[idx].availability.avaiDays

      for (let j = 0; j < avaiDays.length; j++) {
        tmpAvaiDays[avaiDays[j]] = '1'
      }

      return tmpAvaiDays.join(',')
    },

    processOperatingStartHours (idx) {
      const startHours = [...this.services[idx].availability.startHours]
      const startHoursAMPM = this.services[idx].availability.startHoursAMPM

      for (let j = 0; j < startHoursAMPM.length; j++) {
        // Skip the unavailable days
        if (!this.services[idx].availability.avaiDays.includes(j)) {
          continue
        }

        // If service hour violates the dept hour contraint,
        // then exit func and return empty string.
        if (startHoursAMPM[j] === 'am') {
          if (startHours[j] < this.deptStartHrs[this.services[idx].activeAvaiDays[0]]) {
            return ''
          }
        } else if (startHoursAMPM[j] === 'pm') {
          if (startHours[j] > this.deptEndHrs[this.services[idx].activeAvaiDays[0]]) {
            return ''
          }
        }

        // If no service hour violation, then continue processing.
        if (startHoursAMPM[j] === 'pm' && startHours[j] !== 12) {
          startHours[j] += 12
        }
      }
      const tmpStartHours = startHours.map(val => val.toString())
      return tmpStartHours.join(',')
    },

    processOperatingEndHours (idx) {
      const endHours = [...this.services[idx].availability.endHours]
      const endHoursAMPM = this.services[idx].availability.endHoursAMPM

      for (let j = 0; j < endHoursAMPM.length; j++) {
        // Skip the unavailable days
        if (!this.services[idx].availability.avaiDays.includes(j)) {
          continue
        }

        // If service hour violates the dept hour contraint,
        // then exit func and return empty string.
        if (endHoursAMPM[j] === 'am') {
          if (endHours[j] < this.deptStartHrs[this.services[idx].activeAvaiDays[0]]) {
            return ''
          }
        } else if (endHoursAMPM[j] === 'pm') {
          if (endHours[j] > this.deptEndHrs[this.services[idx].activeAvaiDays[0]]) {
            return ''
          }
        }

        // If no service hour violation, then continue processing.
        if (endHoursAMPM[j] === 'pm' && endHours[j] !== 12) {
          endHours[j] += 12
        }
      }
      const tmpEndHours = endHours.map(val => val.toString())
      return tmpEndHours.join(',')
    }

  }
}

</script>
