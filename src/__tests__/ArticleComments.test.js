import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ArticleComments from '../entities/article/ui/ArticleComments/ArticleComments'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

const mockStore = configureStore([])
const initialState = {
  articles: {
    articleComments: {
      'test-slug': [
        {
          id: 1,
          body: 'TEST COMMENT',
          createdAt: new Date().toISOString(),
          author: { username: 'testUser', image: 'testImage.png' },
        },
      ],
    },
  },
  authForm: {
    user: { username: 'testUser' },
  },
}

test('Render Comments', () => {
  const store = mockStore(initialState)

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ArticleComments slug="test-slug" />
      </MemoryRouter>
    </Provider>
  )

  //проверка на отображение комента
  expect(screen.getByText('TEST COMMENT')).toBeInTheDocument()

  // проверка на отображение имени автора
  expect(screen.getByText('testUser')).toBeInTheDocument()
})
