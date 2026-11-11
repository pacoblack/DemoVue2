<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    
    <!-- 顶部简单导航栏，方便测试页面跳转 -->
    <div class="nav">
      <router-link to="/">首页 (HelloWorld)</router-link> |
      <router-link to="/about">第二个页面 (About)</router-link>
    </div>

    <!-- 🌟 路由页面渲染出口，默认会渲染 HelloWorld -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
.nav {
  margin: 20px 0;
  font-size: 16px;
}
.nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 8px;
}
.nav a.router-link-exact-active {
  color: #42b983;
}
</style>
