import Vue from 'vue'
import Router from 'vue-router'
import qrCode from '@/components/qrCode'
import fileList from '@/components/fileList'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'qrCode',
      component: qrCode
    },{
      path: '/fileList',
      name: 'fileList',
      component: fileList
    }
  ]
})
