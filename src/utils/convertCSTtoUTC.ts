/**
 * Convert CST to UTC
 * @param dateString Date string in CST
 * @returns Date in UTC
 */
export function convertCSTtoUTC(dateString: string) {
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() - offset / 60 - 8,
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  )
}
