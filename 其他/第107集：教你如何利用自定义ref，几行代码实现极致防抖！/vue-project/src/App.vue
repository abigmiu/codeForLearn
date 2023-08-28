<template>
  <div class="container">
    <input type="text " v-model="content">
    <p class="result">{{ content }}</p>
    <div>displayLoad1: {{ load1.displayLoad ? 'true' : 'false' }}</div>
    <div>realLoad1: {{ load1.realLoad ? 'true' : 'false' }}</div>
    <div>{{ load1 }}</div>
    <button @click="onToggleLoading">onToggleLoading</button>
  </div>
</template>
<script setup>
import { debounceRef, delayLoadingRef } from './utils/refs';
const content = debounceRef('1')
console.log(content)
const load1 = delayLoadingRef(false, 500);

const onToggleLoading = () => {
  load1.value = !load1.value.realStatus;
  setTimeout(() => {
    console.log(load1.value)
  })
}
</script>