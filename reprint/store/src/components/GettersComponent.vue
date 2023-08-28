<template>
    <div>getters 测试 {{ $store.getters.count }}</div>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$store.commit('add', 1, 2)
      this.$store.dispatch('asyncAdd', 1)
    }, 4000)
  },
  updated () {
    console.log('gettersCOmponent')
  }
}
</script>

<style>

</style>
