<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <preview msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import preview from './components/preview-docx.vue'

export default {
  name: 'App',
  components: {
    preview
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
