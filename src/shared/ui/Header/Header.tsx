import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch } from '../../../app/store'
import defaultImg from '../../../assets/images/default-image.svg'
import { logout, selectUser } from '../../../features/auth/model/authFormSlice'
import { fetchArticles, selectCurrentPage, selectPageSize } from '../../../entities/article/model/articlesSlice'
import { showSuccessToast } from '../../utils/toastify'

import styles from './Header.module.scss'

function Header() {
  const user = useSelector(selectUser)
  const currentPage = useSelector(selectCurrentPage)
  const pageSize = useSelector(selectPageSize)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('user')

    showSuccessToast('🦄 Вы успешно вышли из системы!')

    dispatch(fetchArticles({ page: currentPage, pageSize }))
  }

  return (
    <header className={styles.header}>
      <Link to="/">
        <div className={styles.logo}>RealWorld Blog</div>
      </Link>
      <div className={styles.links}>
        {user ? (
          <>
            <Link to="/new-article">
              <div className={`${styles.createArticle} ${styles.button}`}>Create article</div>
            </Link>
            <Link to="/profile">
              <div className={styles.profile}>
                <div className={styles.profileUserName}>{user.username}</div>
                <img className={styles.img} src={user.image || defaultImg} alt={user.username} />
              </div>
            </Link>
            <button className={`${styles.logout} ${styles.button}`} onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <div className={`${styles.signIn} ${styles.button}`}>Sign In</div>
            </Link>
            <Link to="/sign-up">
              <div className={`${styles.signUp} ${styles.button}`}>Sign Up</div>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
