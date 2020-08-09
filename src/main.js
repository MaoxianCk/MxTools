import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
import "./assets/css/icon.css";
import "./assets/js/directives";
import "babel-polyfill";
import store from './store/store.js';

import globalFunc from '@/assets/js/globalFunc.js';

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "small"
});
Vue.use(globalFunc);
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
