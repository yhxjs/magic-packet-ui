import request from '@/utils/request'
import {
  getTempId
} from '@/utils/auth'
import {
  encrypt
} from '@/utils/secret'

export default {
  login(loginForm) {
    if (getTempId()) {
      return request({
        url: '/user/login',
        method: 'post',
        data: {
          code: loginForm.imgCode,
          name: encrypt(loginForm.name, getTempId(), getTempId()),
          password: encrypt(loginForm.password, getTempId(), getTempId())
        },
      })
    } else {
      return Promise.reject("请先获取验证码")
    }
  },
  info() {
    return request({
      url: '/user/',
      method: 'post'
    })
  },
  logout() {
    return request({
      url: '/user/logout',
      method: 'post'
    })
  }
}