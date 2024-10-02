function dateFormatter(value: string | number) {
  const date = new Date(value)
  const day = date.getDate()
  let month = date.toLocaleString('ru-RU', { month: 'long' })
  month = month.charAt(0).toUpperCase() + month.slice(1)
  const year = date.getUTCFullYear()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${month} ${day}, ${year}. ${hours}:${minutes}.`
}

export default dateFormatter
