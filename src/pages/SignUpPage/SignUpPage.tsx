import React from 'react'

import SignUpForm from '../../features/auth/ui/SignUpForm/SignUpForm'

import styles from './SignUpPage.module.scss'

function SignUpPage() {
  return (
    <div className={styles.signUpPage}>
      <SignUpForm />
    </div>
  )
}

export default SignUpPage
