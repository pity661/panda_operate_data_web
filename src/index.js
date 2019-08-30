import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Main from '@/views/Main'
import Login from '@/views/Login'
import NotFound from '@/views/404'
import Password from '@/views/Password'
import ResetPassword from '@/views/Resetpass'

Vue.use(Router)
// 公用的vue页面
export default new Router({
    base: "/panda_operate_data/",
    
    routes: [
      {
        path: '/login',
        component: Login,
        name: 'login',
        leaf:true,
        hidden: true
      },
      {
        path: '/404',
        component: NotFound,
        name: '404',
        leaf:true,
        hidden: true
      },
      {
        path: '/',
        component: Home,
        name: '主页',
        leaf:false,
        hidden:true,
        children: [
          { path: 'main', component: Main , name: 'dsds',leaf:true,hidden:true,}
        ]
      },
      {
        path: '/password',
        component: Password,
        name: '',
        hidden: true
      },
      {
          path: '/resetpass',
          component: ResetPassword,
          name: '',
          hidden: true
      }
    ]
})

