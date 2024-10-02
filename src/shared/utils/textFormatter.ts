export const truncateText = (text: string, maxLength: number) => {
  if (typeof text !== 'string') return ''
  if (text.length > maxLength) {
    let truncated = text.substring(0, maxLength)
    if (truncated.endsWith(' ')) truncated = truncated.trimEnd()
    return `${truncated}...`
  }
  return text
}

export const truncateTags = (tags: string[], maxTagLength = 10, maxTagsCount = 8) => {
  const truncatedTags = tags.map((tag) => (tag.length > maxTagLength ? `${tag.substring(0, maxTagLength)}...` : tag))
  return truncatedTags.slice(0, maxTagsCount)
}
