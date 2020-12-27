export default {

  setUserId (state, userId) {
    state.userId = userId
  },

  setUserPwd (state, userPwd) {
    state.userPwd = userPwd
  },

  setState (state, clinicState) {
    state.clinicState = clinicState
  },

  setDistrict (state, district) {
    state.district = district
  },

  setClinicId (state, clinicId) {
    state.clinicId = clinicId
  },

  setDeptName (state, deptName) {
    state.deptName = deptName
  },

  setDeptAvaiDays (state, deptAvaiDays) {
    state.deptAvaiDays = deptAvaiDays
  },

  setStartHrs (state, deptStartHrs) {
    state.deptStartHrs = deptStartHrs
  },

  setStartHrsAMPM (state, deptStartHrsAMPM) {
    state.deptStartHrsAMPM = deptStartHrsAMPM
  },

  setEndHrs (state, deptEndHrs) {
    state.deptEndHrs = deptEndHrs
  },

  setEndHrsAMPM (state, deptEndHrsAMPM) {
    state.deptEndHrsAMPM = deptEndHrsAMPM
  },

  setServices (state, services) {
    state.services = services
  }

}
