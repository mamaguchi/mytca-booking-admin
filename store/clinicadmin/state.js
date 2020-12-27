export default () => ({
  // CLINIC-SECTION
  clinicName: '',
  clinicState: '',
  clinicDistrict: '',
  clinicCloseDays: [],
  clinicPubHol: [],
  clinicStaff: [],
  clinicHasAddedStaff: { bool: false },
  clinicHasDeletedStaff: { bool: false },

  // DEPARTMENT-SECTION
  clinicDepts: [],
  deptPanelToggleOpen: null,

  // STAFF-SECTION
  newStaffName: '',
  newStaffId: '',
  newStaffStatusHint: { msg: '' },
  activeClinicStaff: [],
  searchClinicStaffToDel: '',
  clinicStaffToDel: []
})
