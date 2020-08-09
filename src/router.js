import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
const configFile = require("@/config.json");
const moduleRouList = []
for (let item of configFile.moduleList) {
  moduleRouList.push({
    path: '/' + item.name_en,
    component: resolve => require(['./modules/' + item.src_path], resolve),
  })
}
console.log(moduleRouList)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: resolve => require(['./components/Home.vue'], resolve),
    },
    {
      path: '/',
      component: resolve => require(['./components/Home.vue'], resolve),
      children: moduleRouList
    },
  ]
})
