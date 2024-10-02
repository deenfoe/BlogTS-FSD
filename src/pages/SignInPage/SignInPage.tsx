import React from 'react'

import SignInForm from '../../features/auth/ui/SignInForm/SignInForm'

import styles from './SignInPage.module.scss'

function SignInPage() {
  return (
    <div className={styles.signInPage}>
      <SignInForm />
    </div>
  )
}

export default SignInPage
