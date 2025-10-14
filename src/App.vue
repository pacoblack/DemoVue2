<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <hand-write msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// import preview from './components/preview-docx.vue'
import handWrite from './views/FormDemo.vue'

export default {
  name: 'App',
  components: {
    handWrite
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
