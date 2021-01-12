export function formatDate(date) {
  const v = new Date(date)
  return v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate()
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
