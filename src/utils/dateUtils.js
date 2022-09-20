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
  return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
}
export function formatTimeYmd(time) {
  return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
}
