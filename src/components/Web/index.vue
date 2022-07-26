<template>
  <div>
    <svg-icon icon-class="international" @click="click" />
  </div>
</template>

<script>
export default {
  name: 'Web',
  methods: {
    click() {
      window.open('https://www.suntaoblog.com/', '_blank')
    }
  }
}
</script>
