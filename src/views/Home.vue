<template>
  <div>Home</div>
  <div class="nav">
    <router-link to="/about">About</router-link>
    <router-link to="/">Home</router-link>
  </div>
  <div>
    <img src="/bird-1.png" alt="bird-1" />
  </div>
</template>

<script setup></script>

<style scoped>
.nav {
  display: flex;
  gap: 10px;
}
</style>
