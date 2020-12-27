export default {
  SET_CLINIC_NAME (state, clinicName) {
    state.clinicName = clinicName
  },

  SET_CLINIC_STATE (state, clinicState) {
    state.clinicState = clinicState
  },

  SET_CLINIC_DISTRICT (state, clinicDistrict) {
    state.clinicDistrict = clinicDistrict
  },

  SET_CLINIC_CLOSE_DAYS (state, clinicCloseDays) {
    state.clinicCloseDays = clinicCloseDays
  },

  SET_CLINIC_PUB_HOL (state, clinicPubHol) {
    state.clinicPubHol = clinicPubHol
  },

  SET_CLINIC_STAFF (state, clinicStaff) {
    state.clinicStaff = clinicStaff
  },
  ADD_A_NEW_CLINIC_STAFF (state, newClinicStaff) {
    state.clinicStaff.push(newClinicStaff)
  },
  SORT_CLINIC_STAFF (state, sortFunc) {
    state.clinicStaff.sort(sortFunc)
  },

  SET_CLINIC_HAS_ADDED_STAFF (state, clinicAddedStaff) {
    state.clinicHasAddedStaff.bool = clinicAddedStaff
  },

  SET_CLINIC_HAS_DELETED_STAFF (state, clinicDeletedStaff) {
    state.clinicHasDeletedStaff.bool = clinicDeletedStaff
  },

  SET_CLINIC_DEPTS (state, clinicDepts) {
    state.clinicDepts = clinicDepts
  },

  SET_DEPT_PANEL_TOGGLE_OPEN (state, deptPanelToggleOpen) {
    state.deptPanelToggleOpen = deptPanelToggleOpen
  },

  SET_NEW_STAFF_NAME (state, newStaffName) {
    state.newStaffName = newStaffName
  },

  SET_NEW_STAFF_ID (state, newStaffId) {
    state.newStaffId = newStaffId
  },

  SET_NEW_STAFF_STATUS_HINT (state, newStaffStatusHint) {
    state.newStaffStatusHint.msg = newStaffStatusHint
  },

  SET_ACTIVE_CLINIC_STAFF (state, activeClinicStaffArray) {
    state.activeClinicStaff = activeClinicStaffArray
  },

  ADD_ACTIVE_CLINIC_STAFF (state, activeClinicStaff) {
    state.activeClinicStaff.push(activeClinicStaff)
  },

  SET_SEARCH_CLINIC_STAFF_TO_DEL (state, searchClinicStaffToDel) {
    state.searchClinicStaffToDel = searchClinicStaffToDel
  },

  SET_CLINIC_STAFF_TO_DEL (state, clinicStaffToDel) {
    state.clinicStaffToDel = clinicStaffToDel
  }
}
