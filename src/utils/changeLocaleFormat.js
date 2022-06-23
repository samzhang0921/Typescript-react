export const changeLocaleFormat = (number, locale) => {
  if (number && typeof number === 'number') {
    if (['zh', 'ar'].includes(locale.language)) return number
    return number.toLocaleString(`${locale.language}-${locale.country}`)
  }
  return null
}