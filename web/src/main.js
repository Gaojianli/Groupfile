// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui';
import store from './store';
import VueResource from "vue-resource";
import 'muse-ui/dist/muse-ui.css';
import 'typeface-roboto';

Vue.config.productionTip = false
Vue.use(MuseUI);
Vue.use(VueResource);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
