import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'

import { fetchSignUp, selectErrors, selectUser } from '../../model/authFormSlice'
import { showErrorToast, showSuccessToast } from '../../../../shared/utils/toastify'
import { signUpFormSchema } from '../../../../shared/validation/yupSchemas'
import InputField from '../../../../shared/ui/InputField/InputField'
import { AppDispatch } from '../../../../app/store'

import styles from './SignUpForm.module.scss'

interface ISignUpFormValues {
  username: string
  email: string
  password: string
}

function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const errorsFromServer = useSelector(selectErrors)
  const user = useSelector(selectUser)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(signUpFormSchema),
    mode: 'onTouched', // Включает валидацию в реальном времени
  })

  const submitForm: SubmitHandler<ISignUpFormValues> = async (data) => {
    const { username, email, password } = data
    try {
      const resultAction = await dispatch(fetchSignUp({ username, email, password }))
      if (fetchSignUp.fulfilled.match(resultAction)) {
        localStorage.setItem('user', JSON.stringify(resultAction.payload))
      }
    } catch (error) {
      showErrorToast('Ошибка при регистрации. Пожалуйста, попробуйте снова.')
    }
  }

  useEffect(() => {
    if (user) {
      showSuccessToast('🦄 Вы успешно создали  аккаунт!')
      navigate('/')
    }
  }, [user, navigate])

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowerCaseEmail = e.target.value.toLowerCase()
    setValue('email', lowerCaseEmail, { shouldValidate: true }) // обновляем значение и запускаем валидацию
  }

  return (
    <div>
      <h2 className={styles.signUpTitle}>Создать аккаунт</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit(submitForm)}>
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
          placeholder="******"
          register={register}
          errorMessage={errors.password?.message}
        />

        <InputField
          label="Повтор пароля"
          name="repeatPassword"
          type="password"
          placeholder="******"
          register={register}
          errorMessage={errors.repeatPassword?.message}
        />

        <div className={styles.signUpLine} />

        <label className={styles.signUpLabelCheckbox}>
          <input
            type="checkbox"
            // name="agreeCheckbox"
            className={styles.signUpInputCheckbox}
            {...register('agreeCheckbox')}
          />
          Я согласен на обработку моих персональных данных
        </label>
        <p className={styles.errorText}>{errors.agreeCheckbox?.message}</p>

        {errorsFromServer && (
          <>
            {errorsFromServer.email && <p className={styles.errorText}>Email {errorsFromServer.email}</p>}
            {errorsFromServer.username && <p className={styles.errorText}>Username {errorsFromServer.username}</p>}
          </>
        )}

        <button className={styles.signUpButton} type="submit" disabled={!isValid}>
          Создать
        </button>

        <div className={styles.signInInfo}>
          Уже есть аккаунт?{' '}
          <NavLink to="/sign-in" className={styles.navLink}>
            Войти.
          </NavLink>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
