import {
  createRouter,
  createWebHistory
} from 'vue-router'
import {
  ElMessage
} from 'element-plus'
import {
  getToken
} from '@/utils/auth'
import NProgress from 'nprogress'
NProgress.configure({
  showSpinner: false
})
NProgress.configure({
  easing: 'ease',
  speed: 500
})
NProgress.inc(0.2)
const routes = [{
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: {
      title: '404'
    },
    hidden: true
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/404',
    hidden: true
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.title) {
    document.title = to.meta.title + ' | magic-packet'
  } else {
    document.title = 'magic-packet'
  }
  to.meta.referrer = from.fullPath
  if (to.fullPath == '/login') {
    if (getToken()) {
      ElMessage({
        message: '您已登录',
        type: 'warning',
        duration: 5 * 1000
      })
      next('/')
    } else {
      next()
    }
  } else {
    if (getToken()) {
      next()
    } else {
      ElMessage({
        message: '请先登录',
        type: 'warning',
        duration: 5 * 1000
      })
      localStorage.setItem('redirect', to.fullPath)
      next(`/login`)
    }
  }
})
router.afterEach(() => {
  NProgress.done()
  window.scroll(0, 0)
})
export default router