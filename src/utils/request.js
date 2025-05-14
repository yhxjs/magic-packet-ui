import axios from 'axios'
import {
  ElMessage
} from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import {
  getToken,
  removeToken
} from '@/utils/auth'
import NProgress from 'nprogress'
const STATIC_KEY = "yhxjsmagicpacket"
NProgress.configure({
  showSpinner: false
})
NProgress.configure({
  easing: 'ease',
  speed: 500
})
NProgress.inc(0.2)

// create an axios instance
const service = axios.create({
  baseURL: "/magic",
  timeout: 20000,
  withCredentials: false,
  crossDomain: true
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authentication'] = getToken()
    }
    NProgress.start()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    if (response.request.responseType === 'blob') {
      return response
    }
    let url = JSON.stringify(response.request.responseURL)
    const res = response.data
    if (res.code > 300) {
      if (res.code === 503) {
        ElMessage.error({
          message: res.msg,
          grouping: true
        })
        removeToken()
        const userStore = useUserStore()
        userStore.resetUser()
        localStorage.setItem('redirect', location.pathname + location.search)
        location.reload()
      } else {
        ElMessage({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000,
          grouping: true
        })
      }
      NProgress.done()
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      if (url.endsWith("/user/\"")) {
        const userStore = useUserStore()
        userStore.setUser(response.data.data)
      } else if (url.endsWith("/user/logout\"")) {
        if (response.data.code == 211) {
          const userStore = useUserStore()
          userStore.resetUser()
        }
      }
      NProgress.done()
      return res
    }
  },
  error => {
    NProgress.done()
    if (!error.response) {
      ElMessage({
        message: '网络错误，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (error.response.status >= 500) {
      ElMessage({
        message: '服务器错误，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (error.response.status >= 400) {
      ElMessage({
        message: '请求错误，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      ElMessage({
        message: '未知错误，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)
export default service