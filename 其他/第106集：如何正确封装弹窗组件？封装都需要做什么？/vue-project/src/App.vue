<script setup lang="ts">
import { showModal } from './components/dialog';

const onClick = () => {
  showModal('这是标题', () => {
    console.log(123);
  })
}

</script>

<template>
  <div>
    <button @click="onClick">展示弹窗</button>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
