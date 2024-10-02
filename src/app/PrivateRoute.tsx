import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { ReactElement } from 'react'

import { selectIsAuthenticated } from '../features/auth/model/authFormSlice'

interface IPrivateRouteProps {
  element: ReactElement
}

function PrivateRoute({ element }: IPrivateRouteProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return isAuthenticated ? element : <Navigate to="/sign-in" />
}

export default PrivateRoute
