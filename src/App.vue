<template>
  <div id="app">
    <keep-alive :exclude="exclude" :include="include">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      include: '',
      exclude: 'panelGroup'
    }
  }
}
</script>
