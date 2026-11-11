<template>
  <div class="about">
    <h1>这是第二个页面</h1>
    <p>测试 Android WebView 路由跳转与返回功能</p>
    <button @click="goBack" class="btn">返回 HelloWorld 首页</button>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  methods: {
    goBack() {
      // 方式1：使用路由返回上一页（会触发 Android WebView 的历史记录变化）
      this.$router.back()
      // 方式2：也可以直接指定跳回首页：this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.about {
  padding: 20px;
}
.btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
