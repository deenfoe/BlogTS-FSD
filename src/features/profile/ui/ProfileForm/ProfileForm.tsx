import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { clearErrors, fetchUserUpdate, selectErrors, selectUser } from '../../../auth/model/authFormSlice'
import { showSuccessToast } from '../../../../shared/utils/toastify'
import { profileFormSchema } from '../../../../shared/validation/yupSchemas'
import InputField from '../../../../shared/ui/InputField/InputField'
import { AppDispatch } from '../../../../app/store'

import styles from './ProfileForm.module.scss'

interface IProfileFormValues {
  username: string
  email: string
  password?: string | null | undefined
  image?: string | undefined
}

function ProfileForm() {
  const errorsFromServer = useSelector(selectErrors)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [isUpdateError, setIsUpdateError] = useState(false)
  const user = useSelector(selectUser)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(profileFormSchema),
    mode: 'onTouched', // Включает валидацию в реальном времени
    defaultValues: {
      username: user?.username,
      email: user?.email,
      image: user?.image,
    },
  })

  const submitForm = async (userData: IProfileFormValues) => {
    setIsUpdateError(false) // сбрасываем ошибку перед отправкой формы

    const userDataCopy = { ...userData } // создается копия что бы обойти eslint правило no-param-reassign

    if (!userDataCopy.password) {
      delete userDataCopy.password
    }

    try {
      const resultAction = await dispatch(fetchUserUpdate(userData))
      if (fetchUserUpdate.fulfilled.match(resultAction)) {
        localStorage.setItem('user', JSON.stringify(resultAction.payload))
        setIsFormSubmitted(true)
      } else {
        setIsUpdateError(true) // Устанавливаем ошибку если запрос не был успешным
      }
    } catch (error) {
      setIsUpdateError(true) // Устанавливаем ошибку в случае исключения
    }
  }

  useEffect(() => {
    if (isFormSubmitted && !isUpdateError) {
      showSuccessToast('🦄 Вы успешно обновили данные!')
      dispatch(clearErrors())
      navigate('/')
    }
  }, [isFormSubmitted, isUpdateError, navigate, dispatch])

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowerCaseEmail = e.target.value.toLowerCase()
    setValue('email', lowerCaseEmail, { shouldValidate: true }) // обновляем значение и запускаем валидацию
  }

  return (
    <div>
      <h2 className={styles.profileTitle}>Редактирование профиля</h2>

      <form className={styles.editProfileForm} onSubmit={handleSubmit(submitForm)}>
        <InputField
          label="Имя пользователя"
          name="username"
          placeholder="Имя пользователя"
          register={register}
          errorMessage={errors.username?.message}
        />

        <InputField
          label="Email адрес"
          name="email"
          placeholder="Email адрес"
          register={register}
          onInput={handleEmailInput}
          errorMessage={errors.email?.message}
        />

        <InputField
          label="Пароль"
          name="password"
          type="password"
          placeholder="Новый пароль"
          register={register}
          errorMessage={errors.password?.message}
        />

        <InputField
          label="Изображение аватара (URL)"
          name="image"
          placeholder="ссылка"
          register={register}
          errorMessage={errors.image?.message}
        />

        {errorsFromServer && (
          <>
            {errorsFromServer.email && <p className={styles.errorText}>Email {errorsFromServer.email}</p>}
            {errorsFromServer.username && <p className={styles.errorText}>Username {errorsFromServer.username}</p>}
          </>
        )}

        <button type="submit" className={`${styles.profileButton}`}>
          Сохранить
        </button>
      </form>
    </div>
  )
}

export default ProfileForm
