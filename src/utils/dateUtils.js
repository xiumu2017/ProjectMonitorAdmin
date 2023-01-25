const weekArr = ['日', '一', '二', '三', '四', '五', '六']

export function formatDate(date) {
  const v = new Date(date)
  return v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate() + ' 周' + weekArr[v.getDay()]
}

export function formatDateYmd(date) {
  const v = new Date(date)
  return v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate()
}
export function leftDay(date) {
  const v = new Date(date)
  v.setTime(v.getTime() - 24 * 3600 * 1000)
  return v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate()
}
export function rightDay(date) {
  const v = new Date(date)
  v.setTime(v.getTime() + 24 * 3600 * 1000)
  return v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate()
}
export function formatDateTime(time) {
  var m = time.getMonth() + 1
  var d = time.getDate()
  return time.getFullYear() + '-' + fillZero(m) + '-' + fillZero(d) + ' ' + fillZero(time.getHours()) + ':' + fillZero(time.getMinutes()) + ':' + fillZero(time.getSeconds())
}
export function formatTimeYmd(time) {
  var m = time.getMonth() + 1
  var d = time.getDate()
  return time.getFullYear() + '-' + fillZero(m) + '-' + fillZero(d)
}
function fillZero(val) {
  return val < 10 ? '0' + val : val
}