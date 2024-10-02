import * as yup from 'yup'

// Регулярное выражение для валидации email
const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/

// Схема для ProfileForm
export const profileFormSchema = yup.object().shape({
  username: yup
    .string()
    .required('Имя пользователя обязательно')
    .matches(/^[a-zA-Z0-9]+$/, 'Имя пользователя может содержать только латинские буквы и цифры'),
  email: yup
    .string()
    .email('Неверный email')
    .required('Email обязателен')
    .matches(emailRegex, 'Неверный формат email (пример: test@mail.com)'),
  password: yup
    .string()
    .transform((value) => value || undefined) // Преобразует пустую строку в undefined
    .notRequired()
    .min(6, 'Пароль должен быть минимум 6 символов')
    .max(40, 'Пароль должен быть максимум 40 символов')
    .matches(/\S/, 'Пароль не может быть пустым или состоять только из пробелов')
    .optional(),
  image: yup.string().url('Неверный URL').optional(),
})

// Схема для SignInForm
export const signInFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Неверный формат Email')
    .required('Email обязателен')
    .matches(emailRegex, 'Неверный формат email (пример: test@mail.com)'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть минимум 6 символов')
    .max(40, 'Пароль должен быть максимум 40 символов')
    .matches(/\S/, 'Пароль не может быть пустым или содержать пробелы')
    .required('Пароль обязателен'),
})

// Схема для SignUpForm
export const signUpFormSchema = yup.object().shape({
  username: yup
    .string()
    .required('Имя пользователя обязательно')
    .matches(/^[a-zA-Z0-9]+$/, 'Имя пользователя может содержать только латинские буквы и цифры'),
  email: yup
    .string()
    .email('Неверный email')
    .required('Email обязателен')
    .matches(emailRegex, 'Неверный формат email (пример: test@mail.com)'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть минимум 6 символов')
    .max(40, 'Пароль должен быть максимум 40 символов')
    .matches(/\S/, 'Пароль не может быть пустым или состоять только из пробелов')
    .required('Пароль обязателен'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Повтор пароля обязателен'),
  agreeCheckbox: yup.boolean().oneOf([true], 'Вы должны согласиться с условиями'),
})
