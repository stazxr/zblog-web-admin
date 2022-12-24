<template>
  <div class="card-container">
    <el-card class="main-card">
      <div class="card-title">{{ this.$route.meta.title || this.$route.name }}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AlbumRecycle',
  activated() {
    console.log('AlbumRecycle activated')
  }
}
</script>

<style scoped>

</style>
