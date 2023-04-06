import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
import { http } from '@/service/index.js'
import { moment } from './utils/moment.js'
import uView from 'uni_modules/uview-ui'
Vue.use(uView)

Vue.prototype.$http = http
Vue.prototype.$moment = moment
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif