
import * as AdmPgFuncs from '@/utils/functions/AdminPageFuncs'
import * as DeptConsts from '@/utils/constants/mytca_booking/DeptConsts'

export default {
  async getClinicInfo ({ commit }) {
    // TODO: Once token authentication feature has been
    //       added, to obtain credentials and basic clinic
    //       details from Vuex store instead of hardcoding it
    //       like below.
    const userId = '880601105150'
    const userPwd = '88motherfaker88'
    const clinicId = 'kk_maran'
    const district = 'maran'
    const state = 'pahang'

    let clinicDetailsApi = 'http://localhost:8082/admin/clinicdetails'
    const queryStr = `?userId=${userId}&userPwd=${userPwd}&clinicId=${clinicId}&district=${district}&state=${state}`
    clinicDetailsApi = clinicDetailsApi + queryStr
    const { data } = await this.$axios.post(clinicDetailsApi)

    let closeDays = data.clinicCloseDays
    closeDays = closeDays.split(',').map(val => parseInt(val))

    const depts = []

    // LOAD DEPT BASIC DATA OBTAINED FROM DIRECTORY
    const clinicDeptBasicDetailsLst = data.clinicDeptBasicDetailsLst
    clinicDeptBasicDetailsLst.map((val) => {
      const deptObj = {}
      deptObj.deptName = val.clinicDeptName
      const boolVal = !!val.clinicDeptIsEnabled
      deptObj.deptIsEnabled = boolVal
      deptObj.isBasicDataLoaded = true
      deptObj.isAdvDataLoaded = false
      deptObj.isDirty = false
      depts.push(deptObj)
    })

    // INITIALIZE REMAINING UNACTIVATED DEPT WITH DEFAULT VALUE
    const deptsCpy = [...depts]
    for (let m = 0; m < DeptConsts.DEPT_ALL.length; m++) {
      let deptPresent = false
      const deptName = DeptConsts.DEPT_ALL[m]
      for (let n = 0; n < deptsCpy.length; n++) {
        if (deptsCpy[n].deptName === deptName) {
          deptPresent = true
          break
        }
      }
      if (!deptPresent) {
        const deptObj = {}
        deptObj.deptName = deptName
        deptObj.deptIsEnabled = false
        deptObj.isBasicDataLoaded = false
        deptObj.isAdvDataLoaded = false
        deptObj.isDirty = false
        depts.push(deptObj)
      }
    }

    // INITIALIZE OTHER PROPERTIES OF ALL dept OBJECT IN 'depts'
    for (let i = 0; i < depts.length; i++) {
      depts[i].treeviewRootAlwaysOpen = [0]
      // DEPT STAFF
      depts[i].hint = { msg: '' }
      depts[i].hasAddedStaff = { bool: false }
      depts[i].hasDeletedStaff = { bool: false }

      // DEPT OPERATIONAL AVAILABILITY
      depts[i].isPanelFirstLoad = true
      depts[i].hasSelectedNewDay = { sw: false, isDirty: false }
      depts[i].activeAvaiDays = []
      depts[i].avaiDaysContxtView = {
        isClosed: false,
        isAvailable: false
      }

      // SEARCH RELATED
      depts[i].search = {
        clinicDeptStaffToAdd: null,
        clinicDeptStaffToDel: null
      }
      depts[i].clinicDeptStaffToDel = []
      depts[i].activeClinicDeptStaff = []

      // MISC
      depts[i].clinicDeptStaffIds = [[AdmPgFuncs.processStaffIdToTreeViewChildren([])]]
      depts[i].availability = AdmPgFuncs.processOperatingDaysAndHours('', '', '')
      depts[i].clinicDeptMaxPt = 0
    }

    // CLINIC-SECTION
    commit('SET_CLINIC_NAME', data.clinicName)
    commit('SET_CLINIC_STATE', data.clinicState)
    commit('SET_CLINIC_DISTRICT', data.clinicDistrict)
    commit('SET_CLINIC_CLOSE_DAYS', closeDays)
    commit('SET_CLINIC_PUB_HOL', AdmPgFuncs.parsePubHol(data.clinicPublicHolidays))
    commit('SET_CLINIC_STAFF', AdmPgFuncs.processStaffIdToTreeViewChildren(data.clinicStaffIds))

    // DEPARTMENT-SECTION
    commit('SET_CLINIC_DEPTS', depts)

    return new Promise(function (resolve, reject) {
      resolve()
    })
  },

  addStaffToClinic ({ commit, getters }) {
    const existingStaff = getters.getClinicStaff[0][0].children
    for (let j = 0; j < existingStaff.length; j++) {
      if (existingStaff[j].id === getters.getNewStaffId) {
        const msg = 'This staff is already registered in the clinic!'
        commit('SET_NEW_STAFF_STATUS_HINT', msg)
        return
      }
    }

    const msg = `${getters.getNewStaffName} added to the clinic`
    commit('SET_NEW_STAFF_STATUS_HINT', msg)
    const newStaff = {
      id: getters.getNewStaffId,
      name: getters.getNewStaffName
    }
    commit('ADD_A_NEW_CLINIC_STAFF', newStaff)
    if (!getters.getClinicHasAddedStaff) {
      commit('SET_CLINIC_HAS_ADDED_STAFF', true)
    }

    commit('SORT_CLINIC_STAFF', (a, b) => a.name > b.name)
    commit('ADD_ACTIVE_CLINIC_STAFF', getters.getNewStaffId)
  },

  delStaffFrmClinic ({ commit, getters }) {
    if (getters.getClinicStaffToDel.length === 0) {
      return
    }

    const staffIdToDelArr = [...getters.getClinicStaffToDel]
    const staffArr = getters.getClinicStaff[0][0].children

    for (let i = 0; i < staffIdToDelArr.length; i++) {
      for (let j = 0; j < staffArr.length; j++) {
        if (staffArr[j].id === staffIdToDelArr[i]) {
          staffArr.splice(j, 1)
          if (!getters.getClinicHasDeletedStaff) {
            commit('SET_CLINIC_HAS_DELETED_STAFF', true)
          }
          break
        }
      }
    }
  }

}
