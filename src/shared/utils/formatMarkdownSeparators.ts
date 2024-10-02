function formatMarkdownSeparators(markdown: string): string {
  // Проверка, является ли входной аргумент строкой
  if (typeof markdown !== 'string') {
    return '' // Возвращаем пустую строку, если входное значение не является строкой
  }

  // Регулярное выражение для поиска разделителей `***`, `---`, `___`, которые не находятся в таблицах
  return markdown.replace(/(^|\n)(\*{3}|-{3}|_{3})(\n|$)/gm, function handleSeparator(match) {
    // Если строка не содержит символа "|", то это разделитель, который нужно заменить
    if (!match.includes('|')) {
      return '\n___\n'
    }
    // В противном случае это элемент таблицы, который оставляем без изменений
    return match
  })
}

export default formatMarkdownSeparators
