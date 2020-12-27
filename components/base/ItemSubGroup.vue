<template>
  <base-item-group
    :item="item"
    text
    sub-group
  />
</template>

<script>
import ItemGroup from '@/components/base/ItemGroup'

export default {
  name: 'ItemSubGroup',

  components: {
    BaseItemGroup: ItemGroup
  },

  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: []
      })
    }
  }
}
</script>
