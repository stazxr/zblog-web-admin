<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <slot />
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  }
}
</script>
