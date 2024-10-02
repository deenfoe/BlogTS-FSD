import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RollbackOutlined } from '@ant-design/icons'

import { fetchCreateArticle, fetchUpdateArticle } from '../../model/articlesSlice'
import { showErrorToast, showSuccessToast } from '../../../../shared/utils/toastify'
import { AppDispatch } from '../../../../app/store'

import styles from './ArticleForm.module.scss'

interface IArticleFormProps {
  title?: string
  initialData?: {
    title?: string
    description?: string
    body?: string
    tagList?: string[]
    slug?: string
  }
  isEdit?: boolean
}

type FormData = {
  title: string
  description: string
  body: string
}

const schema = yup.object().shape({
  title: yup.string().required('Поле Title является обязательным.'),
  description: yup.string().required('Поле Short description является обязательным.'),
  body: yup.string().required('Поле Text является обязательным.'),
})

function ArticleForm({ title, initialData = {}, isEdit = false }: IArticleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      body: initialData.body || '',
    },
  })

  const { slug } = initialData
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const tagInputRef = useRef<HTMLInputElement | null>(null) // Создаем реф для поля ввода тега
  const [newTag, setNewTag] = useState('')
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    body: initialData.body || '',
    tagList: initialData.tagList || [],
  })

  // Tags
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value)
  }

  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (newTag.trim() !== '') {
      setFormData({
        ...formData,
        tagList: [...formData.tagList, newTag.trim()],
      })
      setNewTag('') // очищаем поле ввода после добавления тега
      tagInputRef.current?.focus()
    }
  }

  const removeTag = (indexToRemove: number) => {
    setFormData({
      ...formData,
      tagList: formData.tagList.filter((_, index) => index !== indexToRemove),
    })
    tagInputRef.current?.focus()
  }

  const removeLastTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (formData.tagList.length > 0) {
      setFormData({
        ...formData,
        tagList: formData.tagList.slice(0, -1), // удаляем последний тег
      })
    }
    tagInputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const submitForm = async (userData: FormData) => {
    const article = {
      ...userData,
      tagList: formData.tagList,
    }
    try {
      if (isEdit) {
        // const { slug } = initialData // slug должен быть передан в initialData
        await dispatch(fetchUpdateArticle({ slug: slug as string, articleData: article })).unwrap()
      } else {
        await dispatch(fetchCreateArticle(article)).unwrap()
      }
      showSuccessToast(isEdit ? '🦄 Статья успешно отредактирована' : '🦄 Статья успешно создана')
      navigate('/') // Перенаправление после успешного выполнения действия
    } catch (error) {
      showErrorToast(`Ошибка ${error} при отправке формы. Пожалуйста, попробуйте снова.`)
    }
  }

  return (
    <div className={styles.articleFormContainer}>
      <h2 className={styles.articleFormTitle}>{title}</h2>
      <form className={styles.articleForm} onSubmit={handleSubmit(submitForm)}>
        <label className={styles.articleFormLabel}>
          Title
          <input
            className={styles.articleFormInput}
            type="text"
            placeholder="Title"
            {...register('title')}
            value={formData.title}
            onChange={handleInputChange}
          />
          <p className={styles.errorText}>{errors.title?.message}</p>
        </label>

        <label className={styles.articleFormLabel}>
          Short description
          <input
            className={styles.articleFormInput}
            type="text"
            placeholder="Short description"
            {...register('description')}
            value={formData.description}
            onChange={handleInputChange}
          />
          <p className={styles.errorText}>{errors.description?.message}</p>
        </label>

        <label className={styles.articleFormLabel}>
          Text
          <textarea
            className={styles.articleFormTextarea}
            // type="text"
            placeholder="Write your article here..."
            {...register('body')}
            value={formData.body}
            onChange={handleInputChange}
          />
          <p className={styles.errorText}>{errors.body?.message}</p>
        </label>

        <label className={styles.articleFormLabel}>
          Tags
          {formData.tagList.map((tag, index) => (
            <div key={index} className={styles.articleFormTags}>
              <input
                className={styles.articleFormInput}
                type="text"
                value={tag}
                readOnly
                // onClick={() => removeTag(index)} // Удаление при клике на тег
              />
              <button className={styles.deleteBtn} type="button" onClick={() => removeTag(index)}>
                Delete
              </button>
            </div>
          ))}
          <div className={styles.articleFormTags}>
            <input
              ref={tagInputRef}
              className={styles.articleFormInput}
              type="text"
              placeholder="Add a tag"
              value={newTag}
              onChange={handleTagChange}
            />
            <button className={styles.deleteBtn} onClick={removeLastTag} type="button">
              Delete
            </button>
            <button className={styles.addBtn} onClick={addTag}>
              Add tag
            </button>
          </div>
        </label>

        <div className={styles.articleFormButtonWrap}>
          <button className={styles.articleFormButton} type="submit" disabled={!isValid}>
            Send
          </button>

          {isEdit && (
            <Link to={`/articles/${slug}`}>
              <RollbackOutlined style={{ color: '#1890FF', scale: '2 ' }} />
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}

export default ArticleForm
