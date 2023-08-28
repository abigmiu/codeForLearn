<template>
  <div id="app">
    <div></div>
  <StateCmp/>
  <GetterCmp />
  </div>
</template>

<script>
import StateCmp from './components/StateComponent.vue'
import GetterCmp from './components/GettersComponent.vue'
export default {
  name: 'App',
  components: {
    StateCmp,
    GetterCmp
  },
  mounted () {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
