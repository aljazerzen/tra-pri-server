import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import VueLocalStorage from 'vue-localstorage';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueLocalStorage);

Vue.url.options.root = process.env.VUE_APP_API_URL;
Vue.http.headers.common['Authorization'] = Vue.localStorage.get('password');

// noinspection JSUnusedGlobalSymbols
new Vue({
  render: h => h(App),
  localStorage: { password: { type: String } },
}).$mount('#app');
