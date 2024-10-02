import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import SignInForm from '../features/auth/ui/SignInForm/SignInForm'
import store from '../app/store'
import '@testing-library/jest-dom'

test('форма входа должна рендериться', () => {
  render(
    <Provider store={store}>
      <Router>
        <SignInForm />
      </Router>
    </Provider>
  )

  // Проверяем что заголовок Войти отображается
  const title = screen.getByRole('heading', { name: /войти/i })
  expect(title).toBeInTheDocument()

  // Проверяем что есть поле для email и password
  const emailInput = screen.getByPlaceholderText(/email адрес/i)
  const passwordInput = screen.getByPlaceholderText('******')
  const submitButton = screen.getByRole('button', { name: /войти/i })

  expect(emailInput).toBeInTheDocument()
  expect(passwordInput).toBeInTheDocument()
  expect(submitButton).toBeInTheDocument()
})
