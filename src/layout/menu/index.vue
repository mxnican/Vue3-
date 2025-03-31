<template>
  <div>
    <h1>{{ menuList }}</h1>
  </div>
</template>

<script setup lang="ts">
//获取父组件传递过来的全部路由数组
defineProps(['menuList'])
</script>

<style scoped>

</style>