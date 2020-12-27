<script>

function symDiff (arr1, arr2) {
  return arr1.filter(x => !arr2.includes(x)).concat(
    arr2.filter(x => !arr1.includes(x))
  )
}

function leftSymDiff (arr1, arr2) {
  return arr1.filter(x => !arr2.includes(x))
}

function intersection (arr1, arr2) {
  return arr1.filter(x => arr2.includes(x))
}

module.exports = {
  symDiff,
  leftSymDiff,
  intersection
}

</script>
