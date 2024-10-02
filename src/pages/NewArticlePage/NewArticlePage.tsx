import ArticleForm from '../../entities/article/ui/ArticleForm/ArticleForm'

import styles from './NewArticlePage.module.scss'

function NewArticlePage() {
  return (
    <div className={styles.newArticlePage}>
      <ArticleForm title="Create article" />
    </div>
  )
}

export default NewArticlePage
