/**
 * 工具类
 */
import CryptoJS from 'crypto-js'
let keyStr = '5a2986bf35e6a0a54f4fe94a8261ab27'

// 加密
// export function encrypt(word, keyStr){
export function encrypt(word) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}

// 解密
// export function decrypt(word, keyStr){
export function decrypt(word) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
