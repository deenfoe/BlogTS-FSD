import { toast } from 'react-toastify'

import { showSuccessToast, showErrorToast } from '../shared/utils/toastify'

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Slide: jest.fn,
}))

describe('toastUtils', () => {
  test('showSuccessToast должен вызывать toast.success с правильным сообщением', () => {
    const message = 'Success!'

    showSuccessToast(message)

    expect(toast.success).toHaveBeenCalledWith(
      message,
      expect.objectContaining({
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: expect.any(Function),
      })
    )
  })

  test('showErrorToast должен вызывать toast.error с правильным сообщением', () => {
    const message = 'Error!'

    showErrorToast(message)

    expect(toast.error).toHaveBeenCalledWith(
      message,
      expect.objectContaining({
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: expect.any(Function),
      })
    )
  })
})
