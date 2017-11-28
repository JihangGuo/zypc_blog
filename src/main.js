// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import vueResource from 'vue-resource'
import  VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index.js'
import $ from 'jquery'
import store from './store/index'




import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.use(vueResource);
Vue.use(ElementUI);
Vue.use(VueRouter);
 
Vue.config.debug = true

const app = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
