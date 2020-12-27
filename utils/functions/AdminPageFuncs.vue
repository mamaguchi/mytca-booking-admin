<script>

function parsePubHol (pubHolArr) {
  return pubHolArr.map((dateStr) => {
    const pubHol = dateStr.split(':')
    const pubHolYr = pubHol[0]
    const pubHolMth = pubHol[1]
    const pubHolDay = pubHol[2].split(',')

    return pubHolDay.map((dayStr) => {
      const res = [pubHolYr, pubHolMth, dayStr]
      return res.join('-')
    })
  }).reduce(twoDimArrToOneDimArr, [])
}

function twoDimArrToOneDimArr (collectorArr, innerArr) {
  for (let i = 0; i < innerArr.length; i++) {
    collectorArr.push(innerArr[i])
  }
  return collectorArr
}

function processStaffIdToTreeView (staffIds) {
  const tmpArr = []
  if (staffIds.length === 0) {
    return { id: 0, name: 'Select all', children: tmpArr }
  }
  staffIds.sort()
  staffIds.map((val, idx, arr) => {
    val = val.split(':')
    tmpArr.push(
      {
        id: val[1],
        name: val[0]
      }
    )
  })
  return { id: 0, name: 'Select all', children: tmpArr }
}

function processStaffIdToTreeViewChildren (staffIds) {
  const tmpArr = []
  if (staffIds.length === 0) {
    return tmpArr
  }
  staffIds.sort()
  staffIds.map((val, idx, arr) => {
    val = val.split(':')
    tmpArr.push(
      {
        id: val[1],
        name: val[0]
      }
    )
  })
  return tmpArr
}

function processOperatingDays (avaiDaysStr) {
  const avaiDays = []

  const avaiDaysIntArr = avaiDaysStr.split(',').map(val => parseInt(val))

  for (let i = 0; i < 7; i++) {
    if (avaiDaysIntArr[i]) { avaiDays.push(i) }
  }

  return avaiDays
}

function processOperatingDaysAndHours (avaiDaysStr, startHoursStr, endHoursStr) {
  const data = {}
  data.avaiDays = []
  data.prevAvaiDays = []
  data.startHours = []
  data.startHoursAMPM = []
  data.endHours = []
  data.endHoursAMPM = []

  if (avaiDaysStr === '') {
    data.startHours = [12, 12, 12, 12, 12, 12, 12]
    data.startHoursAMPM = ['am', 'am', 'am', 'am', 'am', 'am', 'am']
    data.endHours = [12, 12, 12, 12, 12, 12, 12]
    data.endHoursAMPM = ['am', 'am', 'am', 'am', 'am', 'am', 'am']

    return data
  }

  const avaiDaysIntArr = avaiDaysStr.split(',').map(val => parseInt(val))
  const startHoursIntArr = startHoursStr.split(',').map(val => parseInt(val))
  const endHoursIntArr = endHoursStr.split(',').map(val => parseInt(val))

  for (let i = 0; i < 7; i++) {
    if (avaiDaysIntArr[i]) { data.avaiDays.push(i) }

    if (startHoursIntArr[i] <= 12) {
      data.startHours.push(startHoursIntArr[i])
    } else {
      data.startHours.push((startHoursIntArr[i] - 12))
    }

    if (startHoursIntArr[i] < 12) {
      data.startHoursAMPM.push('am')
    } else {
      data.startHoursAMPM.push('pm')
    }

    if (endHoursIntArr[i] <= 12) {
      data.endHours.push(endHoursIntArr[i])
    } else {
      data.endHours.push((endHoursIntArr[i] - 12))
    }

    if (endHoursIntArr[i] < 12) {
      data.endHoursAMPM.push('am')
    } else {
      data.endHoursAMPM.push('pm')
    }
  }

  return data
}

module.exports = {
  parsePubHol,
  twoDimArrToOneDimArr,
  processStaffIdToTreeView,
  processStaffIdToTreeViewChildren,
  processOperatingDays,
  processOperatingDaysAndHours
}

</script>
