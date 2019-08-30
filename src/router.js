import Vue from 'vue'
import App from './App'
import router from './index'
import ElementUI from 'element-ui'
import MenuUtils from '@/utils/MenuUtils'

Vue.use(ElementUI)

let data = JSON.parse(window.sessionStorage.getItem('navbar'));
if (data) {
    //这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
    let routes = []
    MenuUtils(routes,data)
    router.addRoutes(routes)
    // addRoutes不会主动加到这个对象数组中去？？？
    router.options.routes = router.options.routes.concat(routes)
}
router.beforeEach((route, redirect, next) => {
    let data = window.sessionStorage.getItem('navbar')
    if(data && route.path === '/login'){
      //这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，会再次向router实例里面add路由规则，
      //而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，当刷新页面的时候，整个app会重新加载
      //而我们在刷新之前已经把sessionStorage里的user移除了，所以上面的添加路由也不行执行
      window.sessionStorage.removeItem('navbar')
      window.sessionStorage.removeItem('token')
      // 到home页面强制刷新页面，否则导航栏菜单出不来
      window.sessionStorage.removeItem('homeReload')
      window.location.href = '/'
      return false
    }
    if (!data && route.path !== '/login') {
      next({ path: '/login' })
    } else {
      if (route.path) {
        next()
      } else {
        next({ path: '/nofound' })
      }
    }
  })
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
  	render: h => h(App)
}).$mount('#app')


