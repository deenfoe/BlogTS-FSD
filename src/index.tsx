import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from './app/store'
import './index.css'
import App from './app/App'

const rootElement = document.getElementById('root')!

const root = ReactDOM.createRoot(rootElement)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
