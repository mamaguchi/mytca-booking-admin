<template>
  <div>
    <keep-alive>
      <v-expansion-panels
        v-model="deptPanelToggleOpen"
        focusable
        class="mt-10"
        max-width="600"
      >
        <v-expansion-panel
          v-for="(dept,idx) in clinicDepts"
          :key="dept.deptName"
          class="mb-4"
          @click.native.capture="deptPanelClicked(dept,
                                                  $event)"
        >
          <v-expansion-panel-header
            color="success"
            class="py-1"
          >
            <template v-slot:actions>
              <v-icon v-if="dept.deptIsEnabled" color="white">
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
                  mdi-hospital-box-outline
                </v-icon>
                <span class="white--text headline">
                  {{ dept.deptName.toUpperCase() }}
                </span>
              </span>

              <v-spacer />
              <v-btn
                :class="dept.deptIsEnabled? 'green--text':'grey--text text--darken-3'"
                :color="dept.deptIsEnabled? 'white':'grey'"
                @click.stop="deptPanelToggleEnable(dept)"
              >
                Enable
              </v-btn>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ValidationObserver v-slot="{ reset, dirty, invalid }">
              <v-card
                flat
                rounded
                class="rounded-lg"
              >
                <v-card-text class="font-weight-medium grey--text text--darken-4">
                  <v-row no-gutters class="mx-auto">
                    <v-col cols="5" class="text-left mt-4 ml-10">
                      <ValidationProvider v-slot="{ errors }" rules="required|numeric|min:1">
                        <v-text-field
                          v-model="dept.clinicDeptMaxPt"
                          label="Maximum Patient At A Time"
                          :error-messages="errors"
                          clear-icon="mdi-close-circle-outline"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>

                  <v-row no-gutters class="mt-4">
                    <v-col cols="20">
                      <v-divider />
                    </v-col>
                  </v-row>

                  <!--  DEPARTMENT-STAFF  -->
                  <v-row
                    class="pa-4"
                    justify="space-between"
                  >
                    <v-col cols="5" class="d-flex flex-column">
                      <label>Add new staff to {{ dept.deptName.toUpperCase() }} department</label>

                      <v-autocomplete
                        v-model="dept.search.clinicDeptStaffToAdd"
                        return-object
                        class="mt-2"
                        :items="clinicStaff[0][0].children"
                        outlined
                        color="blue-grey lighten-2"
                        label="Search all clinic staff"
                        item-text="name"
                        item-value="id"
                        clearable
                        persistent-hint
                        :hint="dept.hint.msg"
                        @change="dept.hint.msg=''"
                      >
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-medium" v-text="data.item.name" />
                            <!-- <v-list-item-subtitle class="caption" v-text="data.item.group" /> -->
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>

                      <v-spacer />

                      <v-row justify="center" align="end">
                        <v-btn
                          :disabled="dept.search.clinicDeptStaffToAdd===null ||
                            dept.search.clinicDeptStaffToAdd===undefined"
                          class="font-weight-medium grey--text text--darken-2"
                          @click="addStaffToClinicDept(
                            idx,
                            dept.hint,
                            dept.clinicDeptStaffIds
                          )"
                        >
                          <v-icon left>
                            mdi-account-plus
                          </v-icon>
                          Add
                        </v-btn>
                      </v-row>
                    </v-col>

                    <v-divider vertical />

                    <!--  DEPARTMENT-STAFF--CONTEXT-VIEW  -->
                    <v-col>
                      <label class="ml-4">Existing staff</label>

                      <v-text-field
                        v-model="dept.search.clinicDeptStaffToDel"
                        class="mt-2 ml-4"
                        label="Filter"
                        outlined
                        flat
                        hide-details
                        clearable
                      />
                      <v-virtual-scroll
                        :items="dept.clinicDeptStaffIds"
                        :item-height="500"
                        height="250"
                        class="ml-n2 mt-2"
                      >
                        <template v-slot="{ item }">
                          <v-list-item>
                            <v-list-item-content>
                              <v-treeview
                                v-model="dept.clinicDeptStaffToDel"
                                :items="item"
                                :search="dept.search.clinicDeptStaffToDel"
                                open-all
                                :open="dept.treeviewRootAlwaysOpen"
                                dense
                                selectable
                                activatable
                                open-on-click
                                :active.sync="dept.activeClinicDeptStaff"
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
                          :disabled="dept.clinicDeptStaffToDel.length===0"
                          class="font-weight-medium grey--text text--darken-2 mt-5"
                          @click="delStaffFrmClinicDept(
                            idx,
                            dept.clinicDeptStaffIds
                          )"
                        >
                          <v-icon left>
                            mdi-delete
                          </v-icon>
                          Delete
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="20">
                      <v-divider />
                    </v-col>
                  </v-row>

                  <!--  AVAILABLE-DAYS  -->
                  <v-row
                    class="pa-4"
                    justify="space-between"
                  >
                    <v-col cols="5">
                      <label>{{ dept.deptName.toUpperCase() }} department is available on</label>
                      <!-- <ValidationProvider v-slot="{ dirty }"> -->
                      <v-treeview
                        v-model="dept.availability.avaiDays"
                        class="grey--text text--darken-1"
                        :items="daysOfWeek"
                        dense
                        selectable
                        open-on-click
                        transition
                        activatable
                        :active.sync="dept.activeAvaiDays"
                        color="blue"
                        @input="checkServiceAvailability(
                          idx,
                          dept.availability,
                          dept.hasSelectedNewDay,
                          dept
                        )"
                        @update:active="updateAvaiDaysContxtView(
                          idx,
                          $event
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
                            <div v-if="dept.activeAvaiDays.length===0" class="mt-16 pt-6">
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
                              v-else-if="dept.avaiDaysContxtView.isClosed &&
                                dept.activeAvaiDays.length!==0"
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
                                    <pre class="title">Sorry, clinic is closed on {{ idxToDayOfWeek(idx) }}!</pre>
                                  </span>
                                </v-col>
                              </v-row>
                            </div>

                            <div
                              v-else-if="!dept.avaiDaysContxtView.isAvailable &&
                                dept.activeAvaiDays.length!==0"
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
                                    <div class="title">Check the tickbox to activate {{ dept.deptName }} department on {{ idxToDayOfWeek(idx) }}</div>
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
                                      v-model="dept.availability.startHoursAMPM[dept.activeAvaiDays[0]]"
                                      mandatory
                                      tile
                                      color="blue"
                                      group
                                      @change="updateStartHourAMPM(
                                        idx,
                                        $event
                                      )"
                                    >
                                      <v-btn value="am">
                                        AM
                                      </v-btn>
                                      <v-btn value="pm">
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
                                          v-model="dept.availability.startHours[dept.activeAvaiDays[0]]"
                                          :min="1"
                                          :max="12"
                                          :rotate="30"
                                          @change="updateStartHour(
                                            idx,
                                            $event
                                          )"
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
                                      v-model="dept.availability.endHoursAMPM[dept.activeAvaiDays[0]]"
                                      tile
                                      color="blue"
                                      group
                                      @change="updateEndHourAMPM(
                                        idx,
                                        $event
                                      )"
                                    >
                                      <v-btn value="am">
                                        AM
                                      </v-btn>
                                      <v-btn value="pm">
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
                                          v-model="dept.availability.endHours[dept.activeAvaiDays[0]]"
                                          :min="1"
                                          :max="12"
                                          :rotate="30"
                                          @change="updateEndHour(
                                            idx,
                                            $event
                                          )"
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
                      :disabled="invalid"
                      class="font-weight-medium grey--text text--darken-2 mt-n5 mb-n5"
                    >
                      <v-icon left>
                        mdi-doctor
                      </v-icon>
                      <nuxt-link tag="span" to="/clinicadmin/service">
                        Manage Services
                      </nuxt-link>
                    </v-btn>

                    <v-btn
                      text
                      :disabled="!dept.hasAddedStaff.bool &&
                        !dept.hasDeletedStaff.bool &&
                        !dept.hasSelectedNewDay.isDirty &&
                        (!dirty || invalid)"
                      class="font-weight-medium grey--text text--darken-2 mt-n5 mb-n5"
                      @click="saveDeptDataToDirectory(idx, dept.deptName, reset)"
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
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as AdmPgFuncs from '@/utils/functions/AdminPageFuncs'
import * as Sets from '@/utils/functions/math/Sets'
import { mapMutations } from 'vuex'

export default {
  name: 'DeptInfo',

  components: {
    ValidationObserver,
    ValidationProvider
  },

  data () {
    return {
      userId: '880601105150',
      userPwd: '88motherfaker88',
      clinicId: 'kk_maran',
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
      ],
      clinicDepts: this.$store.state.clinicadmin.clinicDepts
    }
  },

  computed: {
    clinicDeptsData () {
      return this.$store.getters['clinicadmin/getClinicDepts']
    },

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
    deptPanelToggleOpen: {
      get () {
        return this.$store.getters['clinicadmin/getDeptPanelToggleOpen']
      },
      async set (idx) {
        this.$store.commit('clinicadmin/SET_DEPT_PANEL_TOGGLE_OPEN', idx)

        if (idx !== null && idx !== undefined) {
          if (this.clinicDepts[idx].isBasicDataLoaded &&
                    !this.clinicDepts[idx].isAdvDataLoaded) {
            // LOAD DEPT ADVANCED DATA
            const userId = this.userId
            const userPwd = this.userPwd
            const deptName = this.clinicDepts[idx].deptName
            const clinicId = 'kk_maran'
            const district = this.clinicDistrict
            const state = this.clinicState
            const isDirty = this.clinicDepts[idx].isDirty
            const isEnabled = this.clinicDepts[idx].deptIsEnabled

            let clinicDeptDetailsApi = 'http://localhost:8082/admin/clinicdeptdetails'
            const queryStr = `?isDirty=${isDirty}&isEnabled=${isEnabled}&userId=${userId}&userPwd=${userPwd}&deptName=${deptName}&clinicId=${clinicId}&district=${district}&state=${state}`
            clinicDeptDetailsApi = clinicDeptDetailsApi + queryStr
            const { data } = await this.$axios.post(clinicDeptDetailsApi)

            // TODO: Add a spinning icon here and retry
            //       $axios.post(clinicDeptDetailsApi) again if data is null/undefined
            this.clinicDepts[idx].clinicDeptMaxPt = data.clinicDeptMaxPt
            this.clinicDepts[idx].clinicDeptStaffIds = [[AdmPgFuncs.processStaffIdToTreeView(data.clinicDeptStaffIds)]]
            this.clinicDepts[idx].availability = AdmPgFuncs.processOperatingDaysAndHours(
              data.clinicDeptAvaiDays,
              data.clinicDeptStartHrs,
              data.clinicDeptEndHrs
            )
            this.clinicDepts[idx].isAdvDataLoaded = true
            this.clinicDepts[idx].treeviewRootAlwaysOpen = [0]

            this.setDeptName(this.clinicDepts[idx].deptName)
            this.setDeptAvaiDays(this.clinicDepts[idx].availability.avaiDays)
            this.setStartHrs(this.clinicDepts[idx].availability.startHours)
            this.setStartHrsAMPM(this.clinicDepts[idx].availability.startHoursAMPM)
            this.setEndHrs(this.clinicDepts[idx].availability.endHours)
            this.setEndHrsAMPM(this.clinicDepts[idx].availability.endHoursAMPM)
          }

          this.setDeptName(this.clinicDepts[idx].deptName)
          if (this.clinicDepts[idx].availability.avaiDays.length === 0) {
            this.clinicDepts[idx].isPanelFirstLoad = false
          }
        }
      }
    },

    clinicName: {
      get () {
        return this.$store.getters['clinicadmin/getClinicName']
      },
      set (newVal) {
        this.$store.commit('clinicadmin/SET_CLINIC_NAME', newVal)
      }
    },

    clinicStaff () {
      return this.$store.getters['clinicadmin/getClinicStaff']
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
    }
  },

  watch: {
    clinicDeptsData (newVal) {
      this.clinicDepts = newVal
    }
  },

  methods: {
    ...mapMutations('admin', {
      setUserId: 'setUserId',
      setUserPwd: 'setUserPwd',
      setState: 'setState',
      setDistrict: 'setDistrict',
      setClinicId: 'setClinicId',
      setDeptName: 'setDeptName',
      setDeptAvaiDays: 'setDeptAvaiDays',
      setStartHrs: 'setStartHrs',
      setStartHrsAMPM: 'setStartHrsAMPM',
      setEndHrs: 'setEndHrs',
      setEndHrsAMPM: 'setEndHrsAMPM'
    }),

    deptPanelClicked (dept, event) {
      // event.target gives you html 'Element' object.
      // event.target.innerHTML & event.target.textContent
      // both give you the Element inner content.
      if (event.target.innerHTML.trim().toLowerCase() === 'enable') {
        // allow click event to propagate for
        // click that occurs on the 'Enable' button.
        return
      }
      if (dept.deptIsEnabled) {
        return
      }
      event.stopPropagation()
    },

    deptPanelToggleEnable (dept) {
      dept.deptIsEnabled = !dept.deptIsEnabled
      if (!dept.deptIsEnabled) {
        this.$store.commit('clinicadmin/SET_DEPT_PANEL_TOGGLE_OPEN', null)
      }
      this.toggleDeptAvaiToDirectory(dept.deptIsEnabled, dept.deptName)
      dept.isDirty = true
    },

    checkServiceAvailability (idx, serviceAvailability, hasSelectedNewDay, dept) {
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
      if (dept.isPanelFirstLoad) {
        dept.isPanelFirstLoad = false
      } else {
        const newlyCheckedOpt = Sets.leftSymDiff(serviceAvailability.avaiDays, serviceAvailability.prevAvaiDays)
        if (newlyCheckedOpt.length !== 0) {
          // We have checked a treeview option
          dept.activeAvaiDays = newlyCheckedOpt
          this.updateAvaiDaysContxtView(idx, dept.activeAvaiDays[0])
        } else {
          // We have unchecked a treeview option
          const newlyUncheckedOpt = Sets.leftSymDiff(serviceAvailability.prevAvaiDays, serviceAvailability.avaiDays)
          if (newlyUncheckedOpt[0] === dept.activeAvaiDays[0]) {
            // We have unchecked a selected active treeview option
            this.updateAvaiDaysContxtView(idx, dept.activeAvaiDays[0])
          }
        }
        hasModifyTreeviewOpt = true
      }

      // This block of code checks whether the currently
      // checked treeview options are allowed by deptAvaiDays.
      // If not allowed, the option will be unchecked programatically.
      const tmpArr = [...serviceAvailability.avaiDays]
      serviceAvailability.avaiDays = Sets.leftSymDiff(tmpArr, this.clinicCloseDays)
      serviceAvailability.prevAvaiDays = serviceAvailability.avaiDays
      this.setDeptAvaiDays(serviceAvailability.avaiDays)
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

    toggleDeptAvaiToDirectory (deptIsEnabled, deptName) {
      const output = {}

      output.userId = this.userId
      output.userPwd = this.userPwd
      output.state = this.clinicState
      output.district = this.clinicDistrict
      output.clinicName = this.clinicName
      output.deptName = deptName
      output.deptIsEnabled = deptIsEnabled ? '1' : '0'

      const data = JSON.stringify(output)

      this.$axios.post('http://localhost:8082/admin/toggledeptavai', data)
        .then((response) => {
          alert('Dept availability toggled successfully to: ' +
                output.deptIsEnabled)
        }, (response) => {
          alert('Dept availability toggle failed!')
        })
    },

    saveDeptDataToDirectory (idx, deptName, reset) {
      const output = {}

      output.userId = this.userId
      output.userPwd = this.userPwd
      output.state = this.clinicState
      output.district = this.clinicDistrict
      output.clinicName = this.clinicName
      output.deptName = deptName
      output.deptIsEnabled = this.clinicDepts[idx].deptIsEnabled ? '1' : '0'
      output.deptAvaiDays = this.processOperatingDays(idx)
      output.deptStartHrs = this.processOperatingStartHours(idx)
      output.deptEndHrs = this.processOperatingEndHours(idx)
      output.deptStaffIds = this.processTreeViewToServiceStaffId(idx)
      output.deptNumOfStaff = output.deptStaffIds.length.toString()
      output.deptMaxPt = this.clinicDepts[idx].clinicDeptMaxPt.toString()

      const data = JSON.stringify(output)

      if (this.clinicDepts[idx].isBasicDataLoaded) {
        // UPDATE DEPT
        this.$axios.post('http://localhost:8082/admin/updatedept', data)
          .then((response) => {
            reset()
            this.clinicDepts[idx].hasAddedStaff.bool = false
            this.clinicDepts[idx].hasDeletedStaff.bool = false
            this.clinicDepts[idx].hasSelectedNewDay.isDirty = false
            alert('Dept data updated successfully!')
          }, (response) => {
            alert('Dept data update failed!')
          })
      } else {
        // ADD A NEW DEPT
        this.$axios.post('http://localhost:8082/admin/adddept', data)
          .then((response) => {
            this.clinicDepts[idx].isBasicDataLoaded = true
            reset()
            this.clinicDepts[idx].hasAddedStaff.bool = false
            this.clinicDepts[idx].hasDeletedStaff.bool = false
            this.clinicDepts[idx].hasSelectedNewDay.isDirty = false
            alert('New dept added successfully!')
          }, (response) => {
            alert('New dept add failed!')
          })
      }

      this.setDeptAvaiDays(this.clinicDepts[idx].availability.avaiDays)
      this.setStartHrs(this.clinicDepts[idx].availability.startHours)
      this.setStartHrsAMPM(this.clinicDepts[idx].availability.startHoursAMPM)
      this.setEndHrs(this.clinicDepts[idx].availability.endHours)
      this.setEndHrsAMPM(this.clinicDepts[idx].availability.endHoursAMPM)
    },

    processTreeViewToServiceStaffId (idx) {
      const staffIds = this.clinicDepts[idx].clinicDeptStaffIds[0][0].children

      return staffIds.map((val) => {
        const tmpArr = [val.name, val.id]
        return tmpArr.join(':')
      })
    },

    processOperatingDays (idx) {
      const tmpAvaiDays = ['0', '0', '0', '0', '0', '0', '0']
      const avaiDays = this.clinicDepts[idx].availability.avaiDays

      for (let j = 0; j < avaiDays.length; j++) {
        tmpAvaiDays[avaiDays[j]] = '1'
      }

      return tmpAvaiDays.join(',')
    },

    processOperatingStartHours (idx) {
      const startHours = [...this.clinicDepts[idx].availability.startHours]
      const startHoursAMPM = this.clinicDepts[idx].availability.startHoursAMPM

      for (let j = 0; j < startHoursAMPM.length; j++) {
        if (startHoursAMPM[j] === 'pm' && startHours[j] !== 12) {
          startHours[j] += 12
        }
      }
      const tmpStartHours = startHours.map(val => val.toString())
      return tmpStartHours.join(',')
    },

    processOperatingEndHours (idx) {
      const endHours = [...this.clinicDepts[idx].availability.endHours]
      const endHoursAMPM = this.clinicDepts[idx].availability.endHoursAMPM

      for (let j = 0; j < endHoursAMPM.length; j++) {
        if (endHoursAMPM[j] === 'pm' && endHours[j] !== 12) {
          endHours[j] += 12
        }
      }
      const tmpEndHours = endHours.map(val => val.toString())
      return tmpEndHours.join(',')
    },

    idxToDayOfWeek (idx) {
      const activeAvaiDays = this.clinicDepts[idx].activeAvaiDays[0]
      return this.daysOfWeek[activeAvaiDays].name
    },

    addStaffToClinicDept (idx, searchHint, staffIds) {
      const existingStaff = staffIds[0][0].children

      const staffToAdd = this.clinicDepts[idx].search.clinicDeptStaffToAdd
      if (staffToAdd === null || staffToAdd === undefined) {
        return
      }
      for (let j = 0; j < existingStaff.length; j++) {
        if (existingStaff[j].id === staffToAdd.id) {
          searchHint.msg = `${staffToAdd.name} is already in the department!`
          return
        }
      }
      existingStaff.push(staffToAdd)
      searchHint.msg = `${staffToAdd.name} added to the department`
      existingStaff.sort((a, b) => a.name > b.name)
      this.clinicDepts[idx].activeClinicDeptStaff.push(staffToAdd.id)
      if (!this.clinicDepts[idx].hasAddedStaff.bool) {
        this.clinicDepts[idx].hasAddedStaff.bool = true
      }
      this.clinicDepts[idx].treeviewRootAlwaysOpen = [0]
    },

    delStaffFrmClinicDept (idx, staffIds) {
      const staffToDel = this.clinicDepts[idx].clinicDeptStaffToDel

      if (staffToDel.length === 0) {
        return
      }
      const staffIdToDelArr = [...staffToDel]
      const staffArr = staffIds[0][0].children
      for (let k = 0; k < staffIdToDelArr.length; k++) {
        for (let j = 0; j < staffArr.length; j++) {
          if (staffArr[j].id === staffIdToDelArr[k]) {
            staffArr.splice(j, 1)
            if (!this.clinicDepts[idx].hasDeletedStaff.bool) {
              this.clinicDepts[idx].hasDeletedStaff.bool = true
            }
            break
          }
        }
      }
    },

    updateAvaiDaysContxtView (idx, eventSelectedDay) {
      const contxtView = this.clinicDepts[idx].avaiDaysContxtView

      if (this.clinicCloseDays.includes(parseInt(eventSelectedDay))) {
        contxtView.isClosed = true
      } else {
        if (this.clinicDepts[idx].availability.avaiDays.includes(parseInt(eventSelectedDay))) {
          contxtView.isAvailable = true
        } else {
          contxtView.isAvailable = false
        }
        contxtView.isClosed = false
      }
    },

    updateStartHourAMPM (idx, eventStartHrAMPM) {
      const activeAvaiDays = this.clinicDepts[idx].activeAvaiDays
      this.clinicDepts[idx].availability.startHoursAMPM[activeAvaiDays] = eventStartHrAMPM
    },

    updateStartHour (idx, eventStartHr) {
      const activeAvaiDays = this.clinicDepts[idx].activeAvaiDays
      this.clinicDepts[idx].availability.startHours[activeAvaiDays] = eventStartHr
    },

    updateEndHourAMPM (idx, eventEndHrAMPM) {
      const activeAvaiDays = this.clinicDepts[idx].activeAvaiDays
      this.clinicDepts[idx].availability.endHoursAMPM[activeAvaiDays] = eventEndHrAMPM
    },

    updateEndHour (idx, eventEndHr) {
      const activeAvaiDays = this.clinicDepts[idx].activeAvaiDays
      this.clinicDepts[idx].availability.endHours[activeAvaiDays] = eventEndHr
    },

    allowedDates: val => parseInt(val.split('-')[2], 10) % 2 === 0
  }

}
</script>
