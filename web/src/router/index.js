import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import qrCode from '@/components/qrCode'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'qrCode',
      component: qrCode
    },
    {
      path: '/HelloWord',
      name: 'HelloWord',
      component: HelloWorld
    }
  ]
})
