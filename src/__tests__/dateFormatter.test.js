import dateFormatter from '../shared/utils/dateFormatter'

test('форматирует дату правильно', () => {
  const value = '2024-09-11T12:34:56Z' // формат iso

  const expected = 'Сентябрь 11, 2024. 15:34.'

  const result = dateFormatter(value)

  expect(result).toBe(expected)
})
