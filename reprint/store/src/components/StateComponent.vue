<template>
  <div>state 测试： {{ $store.state.a }}</div>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$store.state.a = 123
    }, 2000)
  },
  updated () {
    console.log('stateComponent')
  }
}
</script>

<style>

</style>
