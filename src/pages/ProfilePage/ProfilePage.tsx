import React from 'react'

import ProfileForm from '../../features/profile/ui/ProfileForm/ProfileForm'

import styles from './ProfilePage.module.scss'

function ProfilePage() {
  return (
    <div className={styles.ProfilePage}>
      <ProfileForm />
    </div>
  )
}

export default ProfilePage
