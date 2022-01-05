import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
import uView from "uview-ui"
import moment from 'moment'

// 定义全局时间戳过滤器
Vue.prototype.$moment = moment
moment.locale('zh-cn')
Vue.filter('formatDate', (str, defaultStr = 'YYYY-MM-DD') => moment(str).format(defaultStr))
Vue.filter('fromNow', (dateStr, defaultFormat = 'YYYY-MM-DD HH:mm:ss') => moment(dateStr).fromNow())

Vue.use(uView)
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