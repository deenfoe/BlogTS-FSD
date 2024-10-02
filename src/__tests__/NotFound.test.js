import React from 'react'
import NotFound from '../shared/ui/NotFound/NotFound'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

test('Отображение компонента NotFound', () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  )

  // проверка на титул с текстом
  const titleElement = screen.getByText(/Страница не найдена/i)
  expect(titleElement).toBeInTheDocument

  // проверка на подзаголовок
  const subtitleElement = screen.getByText(/Sorry, the page you visited does not exist./i)
  expect(subtitleElement).toBeInTheDocument()

  // проверка на кнопку
  const button = screen.getByRole('button', { name: /Вернуться на главную/i })
  expect(button).toBeInTheDocument()
})
