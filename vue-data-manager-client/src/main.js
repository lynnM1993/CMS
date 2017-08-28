import Vue from 'vue';
import App from './App.vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import store from "./store"


//配置路由
import VueRouter from 'vue-router';     //路由依赖
import routes from './router.config';       // 路由列表
Vue.use(VueRouter);
const router = new VueRouter(routes);


//配置iview
Vue.use(iView);

//引入并配置axios
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);
// axios.defaults.withCredentials=true;//所有的axios都默认 携带凭证

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
