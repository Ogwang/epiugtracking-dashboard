// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from './config'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

const firebase = require('firebase')
firebase.initializeApp(config.firebase)
Vue.$firebase = firebase
Vue.prototype.$firebase = firebase

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
