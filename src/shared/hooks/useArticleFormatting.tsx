import { truncateText, truncateTags } from '../utils/textFormatter'

import useWindowSize from './useWindowSize'

interface IArticle {
  title: string
  description: string
  tagList?: string[]
}

function useArticleFormatting(article: IArticle, isFullArticle: boolean) {
  const { width = 400 } = useWindowSize()

  let titleMaxLength
  if (width < 450) {
    titleMaxLength = 10
  } else if (width < 500) {
    titleMaxLength = 16
  } else if (width < 550) {
    titleMaxLength = 20
  } else if (width < 600) {
    titleMaxLength = 26
  } else if (width < 650) {
    titleMaxLength = 35
  } else if (width < 700) {
    titleMaxLength = 40
  } else {
    titleMaxLength = 50
  }

  let descriptionMaxLength
  if (width < 500) {
    descriptionMaxLength = 23
  } else if (width < 550) {
    descriptionMaxLength = 70
  } else if (width < 600) {
    descriptionMaxLength = 78
  } else if (width < 650) {
    descriptionMaxLength = 85
  } else if (width < 700) {
    descriptionMaxLength = 94
  } else if (width < 750) {
    descriptionMaxLength = 102
  } else if (width < 800) {
    descriptionMaxLength = 109
  } else if (width < 850) {
    descriptionMaxLength = 115
  } else if (width < 900) {
    descriptionMaxLength = 120
  } else {
    descriptionMaxLength = 140
  }

  let tagMaxLength
  let maxTagsCount
  if (width < 500) {
    tagMaxLength = 6
    maxTagsCount = 2
  } else if (width < 600) {
    tagMaxLength = 8
    maxTagsCount = 2
  } else if (width < 700) {
    tagMaxLength = 8
    maxTagsCount = 2
  } else if (width < 800) {
    tagMaxLength = 8
    maxTagsCount = 4
  } else if (width < 928) {
    tagMaxLength = 8
    maxTagsCount = 4
  } else {
    tagMaxLength = 10
    maxTagsCount = 5
  }

  if (isFullArticle) {
    return {
      truncatedTitle: article.title,
      truncatedDescription: article.description,
      truncatedTagList: truncateTags(article.tagList || [], 20, Infinity) || [],
    }
  }

  const truncatedTitle = truncateText(article.title, titleMaxLength)
  const truncatedDescription = truncateText(article.description, descriptionMaxLength)
  const truncatedTagList = truncateTags(article.tagList || [], tagMaxLength, maxTagsCount)

  return { truncatedTitle, truncatedDescription, truncatedTagList }
}

export default useArticleFormatting
