export function formatDate(date) {
  const v = new Date(date)
  return v.getFullYear() + '/' + (v.getMonth() + 1) + '/' + v.getDate()
}
