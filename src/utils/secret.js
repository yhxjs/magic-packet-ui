import CryptoJS from 'crypto-js'

export function encrypt(value, key, iv) {
  if (!value || value == '') {
    return value
  }
  value = CryptoJS.enc.Utf8.parse(value)
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv.slice(0, 16))
  let encrypted = CryptoJS.AES.encrypt(value, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

export function decrypt(value, key, iv) {
  if (!value || value == '') {
    return value
  }
  let base64 = CryptoJS.enc.Base64.parse(value)
  value = CryptoJS.enc.Base64.stringify(base64)
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv.slice(0, 16))
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}