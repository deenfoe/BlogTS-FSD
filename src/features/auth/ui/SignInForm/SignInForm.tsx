import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppDispatch } from '../../../../app/store'
import { clearErrors, fetchSignIn, selectErrors, selectUser } from '../../model/authFormSlice'
import { showErrorToast, showSuccessToast } from '../../../../shared/utils/toastify'
import { signInFormSchema } from '../../../../shared/validation/yupSchemas'
import InputField from '../../../../shared/ui/InputField/InputField'

interface ISignInFormValues {
  email: string
  password: string
}

const StyledTitle = styled.h2`
  font-family: 'Roboto';
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  margin: 0 0 25px;
`
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`
const StyledButton = styled.button`
  height: 40px;
  background-color: #1890ff;
  border-radius: 4px;
  border: none;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 8px;
  margin-top: 9px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #188fff68; /* Цвет для неактивной кнопки */
    cursor: not-allowed;
  }
`
const StyledSignUpInfo = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  & a {
    color: #1890ff;
    font-weight: 800;
  }
`
const StyledErrorText = styled.p`
  margin: 0;
  padding: 0;
  color: red;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  font-family: 'Roboto';
`

function SignInForm() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const errorsFromServer = useSelector(selectErrors)
  const user = useSelector(selectUser)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ISignInFormValues>({ resolver: yupResolver(signInFormSchema), mode: 'onTouched' })

  const submitForm: SubmitHandler<ISignInFormValues> = async (data) => {
    const { email, password } = data
    try {
      const resultAction = await dispatch(fetchSignIn({ email, password }))
      if (fetchSignIn.fulfilled.match(resultAction)) {
        localStorage.setItem('user', JSON.stringify(resultAction.payload))
      }
    } catch (error) {
      showErrorToast('Ошибка при входе. Пожалуйста, попробуйте снова.')
    }
  }

  useEffect(() => {
    if (user) {
      showSuccessToast('🦄 Вы успешно вошли в систему!')

      navigate('/')
      dispatch(clearErrors())
    }
  }, [user, navigate, dispatch])

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowerCaseEmail = e.target.value.toLowerCase()
    setValue('email', lowerCaseEmail, { shouldValidate: true }) // обновляем значение и запускаем валидацию
  }

  return (
    <>
      <StyledTitle>Войти</StyledTitle>
      <StyledForm onSubmit={handleSubmit(submitForm)}>
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

        {errorsFromServer && (
          <StyledErrorText>Email or password {errorsFromServer['email or password']}</StyledErrorText>
        )}

        <StyledButton type="submit" disabled={!isValid}>
          Войти
        </StyledButton>

        <StyledSignUpInfo>
          Нет аккаунта? <NavLink to="/sign-up">Зарегистрироваться.</NavLink>
        </StyledSignUpInfo>
      </StyledForm>
    </>
  )
}

export default SignInForm
