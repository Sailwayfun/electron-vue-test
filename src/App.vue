<template>
  <div>
    <h1>Hello World</h1>
    <router-view />
  </div>
</template>

<script setup>
console.log("Base URL:", import.meta.env.BASE_URL); // Check the base URL
</script>

<style lang="scss" scoped></style>
