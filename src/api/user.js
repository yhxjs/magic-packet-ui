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
  },
  changePassword(passwordForm) {
    if (getTempId()) {
      return request({
        url: '/user/changePassword',
        method: 'post',
        data: {
          oldPassword: encrypt(passwordForm.oldPassword, getTempId(), getTempId()),
          newPassword: encrypt(passwordForm.newPassword, getTempId(), getTempId())
        },
      })
    } else {
      return Promise.reject("登录状态异常，请刷新页面重试")
    }
  }
}