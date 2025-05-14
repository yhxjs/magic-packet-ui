import Cookies from 'js-cookie'

const TokenKey = 'Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, exp) {
  return Cookies.set(TokenKey, token, {
    expires: exp
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTempId() {
  return Cookies.get('tempId')
}