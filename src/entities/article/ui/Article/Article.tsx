import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Markdown from 'markdown-to-jsx'
import { useDispatch, useSelector } from 'react-redux'
import { Popover, Button, Popconfirm } from 'antd'
import { HeartOutlined, HeartFilled, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import {
  fetchDeleteArticle,
  fetchFavoriteArticle,
  fetchUnFavoriteArticle,
  resetSuccess,
} from '../../model/articlesSlice'
import { selectUser } from '../../../../features/auth/model/authFormSlice'
import defaultImg from '../../../../assets/images/default-image.svg'
import formatMarkdownSeparators from '../../../../shared/utils/formatMarkdownSeparators'
import dateFormatter from '../../../../shared/utils/dateFormatter'
import useArticleFormatting from '../../../../shared/hooks/useArticleFormatting'
import { showSuccessToast } from '../../../../shared/utils/toastify'
import { AppDispatch } from '../../../../app/store'

import styles from './Article.module.scss'

interface IArticle {
  slug: string
  body: string
  title: string
  description: string
  favorited: boolean
  favoritesCount: number
  tagList: string[]
  createdAt: string
  author: {
    username: string
    image: string | null
  }
}

interface IArticleProps {
  article: IArticle
  variant: 'full' | 'list'
}

function Article({ article, variant }: IArticleProps) {
  const { slug } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [popoverOpen, setPopoverOpen] = useState(false)

  const isFullArticle = variant === 'full'

  // Преобразуем разделители в теле статьи
  const formattedBody = formatMarkdownSeparators(article.body)

  // Получаем текущего пользователя из состояния Redux
  const currentUser = useSelector(selectUser)

  // Проверяем, является ли текущий пользователь автором статьи
  const isAuthor = currentUser && currentUser.username === article.author.username

  // Функция для удаления статьи
  const handleDeleteArticle = async () => {
    if (!slug) return
    dispatch(resetSuccess())
    await dispatch(fetchDeleteArticle(slug))
    showSuccessToast('🦄 Статья успешно удалена')
    navigate('/')
  }

  const handleFavorite = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault() // Предотвращаем переход по ссылке
    event.stopPropagation() // Останавливаем всплытие события

    if (currentUser) {
      dispatch(fetchFavoriteArticle(article.slug))
    } else {
      setPopoverOpen(true)
      setTimeout(() => setPopoverOpen(false), 3000) // Скрыть Popover через 3 секунды
    }
  }

  const handleUnFavorite = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault() // Предотвращаем переход по ссылке
    event.stopPropagation() // Останавливаем всплытие события

    dispatch(fetchUnFavoriteArticle(article.slug))
  }

  const { truncatedTitle, truncatedDescription, truncatedTagList } = useArticleFormatting(article, isFullArticle)

  const articleContent = (
    <div className={`${styles.article} ${isFullArticle ? styles.full : styles.list}`}>
      <div className={styles.articleHeaderWrap}>
        <div className={styles.articleInfo}>
          <div className={styles.articleInfoHeader}>
            <h1 className={styles.articleInfoTitle}>{truncatedTitle}</h1>

            <Popover
              content={
                <span className={styles.articleInfoError}>
                  <ExclamationCircleOutlined />
                  Войдите, чтобы добавить эту статью в избранное.
                </span>
              }
              trigger="click"
              open={popoverOpen}
              onOpenChange={(open) => !open && setPopoverOpen(false)} // Скрывать Popover при клике вне его
            >
              <div
                className={styles.articleInfoFavorite}
                role="button" // Добавляем роль "button"
                tabIndex={0} // Делает элемент фокусируемым
                onClick={article.favorited ? handleUnFavorite : handleFavorite}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault() // Чтобы пробел не прокручивал страницу
                    if (article.favorited) {
                      handleUnFavorite(event)
                    } else {
                      handleFavorite(event)
                    }
                  }
                }}
              >
                {article.favorited ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                <span>{article.favoritesCount}</span>
              </div>
            </Popover>
          </div>

          <div className={styles.articleInfoTags}>
            {truncatedTagList.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
          <p className={styles.articleInfoDesc}>{truncatedDescription}</p>
        </div>

        <div className={styles.articleAuthorWrap}>
          <div className={styles.articleAuthor}>
            <div>
              <p className={styles.articleAuthorName}>{article.author.username}</p>
              <p className={styles.articleAuthorDate}>{dateFormatter(article.createdAt)}</p>
            </div>
            <img className={styles.img} src={article.author.image || defaultImg} alt={article.author.username} />
          </div>

          {isFullArticle && isAuthor && (
            <div className={styles.articleAuthorButtons}>
              <Popconfirm
                className={styles.deleteBtn}
                onConfirm={handleDeleteArticle}
                placement="bottomRight"
                title="Вы точно хотите удалить эту статью?"
                okText="Да"
                cancelText="Нет"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <Button
                  danger
                  style={{
                    color: '#f5222d',
                    borderColor: '#f5222d',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget
                    target.style.backgroundColor = '#f5222d'
                    target.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget
                    target.style.backgroundColor = ''
                    target.style.color = '#f5222d'
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>

              <Link to="edit">
                <button type="button" className={styles.editBtn}>
                  Edit
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {isFullArticle && (
        <div className={styles.articleBody}>
          <Markdown>{formattedBody}</Markdown>
        </div>
      )}
    </div>
  )

  return isFullArticle ? articleContent : <Link to={`/articles/${article.slug}`}>{articleContent}</Link>
}

export default Article
