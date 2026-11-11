import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import AboutPage from '../views/AboutPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld,
    // 通过 props 给 HelloWorld 传递默认的 msg 参数
    props: { msg: 'Welcome to Your Vue.js App' }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  }
]

const router = new VueRouter({
  // 🌟 关键：Android 本地 file:// 加载必须使用 hash 模式，否则跳转后刷新会白屏
  mode: 'hash',
  routes
})

export default router
