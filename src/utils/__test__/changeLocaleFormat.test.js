import { changeLocaleFormat } from '../changeLocaleFormat'

describe('changeLocaleFormat', () => {
  it('should return null if does not receive number arg', () => {
    const result = changeLocaleFormat('e3', { language: 'en', country: 'gb' })
    expect(result).toBeNull()
  })

  it('should return unformatted number if language is arabic or chinese', () => {
    const result1 = changeLocaleFormat(3500, { language: 'ar', country: 'ae' })
    const result2 = changeLocaleFormat(3500, { language: 'zh', country: 'cn' })
    expect(result1).toEqual(result2)
    expect(result2).toEqual(3500)
  })

  it('should return formatted string', () => {
    const result1 = changeLocaleFormat(3500, { language: 'en', country: 'gb' })
    expect(result1).toBe('3,500')
  })

})
