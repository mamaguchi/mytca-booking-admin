export default {
  getClinicName (state) {
    return state.clinicName
  },
  getClinicState (state) {
    return state.clinicState
  },
  getClinicDistrict (state) {
    return state.clinicDistrict
  },
  getClinicCloseDays (state) {
    return state.clinicCloseDays
  },
  getClinicPubHol (state) {
    return state.clinicPubHol
  },
  getClinicStaff (state) {
    return [[{
      id: 0,
      name: 'Select all',
      children: state.clinicStaff
    }]]
  },
  getClinicStaffLength (state) {
    return state.clinicStaff.length
  },
  getClinicHasAddedStaff (state) {
    return state.clinicHasAddedStaff.bool
  },
  getClinicHasDeletedStaff (state) {
    return state.clinicHasDeletedStaff.bool
  },
  getClinicDepts (state) {
    return state.clinicDepts
  },
  getDeptPanelToggleOpen (state) {
    return state.deptPanelToggleOpen
  },
  getClinicDeptUnderConfig (state) {
    return state.clinicDepts[state.deptPanelToggleOpen].deptName
  },
  getNewStaffName (state) {
    return state.newStaffName
  },
  getNewStaffId (state) {
    return state.newStaffId
  },
  getNewStaffStatusHint (state) {
    return state.newStaffStatusHint.msg
  },
  getActiveClinicStaff (state) {
    return state.activeClinicStaff
  },
  getSearchClinicStaffToDel (state) {
    return state.searchClinicStaffToDel
  },
  getClinicStaffToDel (state) {
    return state.clinicStaffToDel
  }
}
