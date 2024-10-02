import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppDispatch } from '../../../../app/store'
import dateFormatter from '../../../../shared/utils/dateFormatter'
import { selectUser, selectUsername } from '../../../../features/auth/model/authFormSlice'
import {
  fetchArticleComments,
  fetchCreateComment,
  fetchDeleteComment,
  selectCommentsBySlug,
} from '../../model/articlesSlice'

interface IArticleCommentsProps {
  slug: string
}

const StyledCommentsWrapper = styled.div`
  margin-top: 15px;
  width: 100%;
`
const StyledTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  @media (max-width: 938px) {
    margin-left: 15px;
  }
`
const StyledComment = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
`
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
`
const AuthorWrapper = styled.div`
  display: flex;
  align-items: center;
`
const AuthorName = styled.h3`
  font-size: 14px;
  color: #555;
`
const AuthorImage = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  object-fit: cover;
  object-position: center;
`
const ArticleCreated = styled.p`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
`

const CommentText = styled.p`
  font-size: 16px;
  color: black;
`
const DeleteButton = styled.button`
  text-align: center;
  height: 31.1px;
  min-width: 78.23px;
  color: #f5222d;
  border-color: #f5222d;
  max-width: 78px;
  background-color: #ffff;
  border-radius: 5px;
  font-size: 14px;
  font-family: 'Inter';
  border: 1px solid;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1)
    background-color: #f0f0f0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f5222d;
    color: #fff;
  }
`
const StyledNoComments = styled.p`
  font-size: 16px;
  color: #888;
  text-align: center;
  margin: 20px 0;
`
const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const CommentTextarea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  outline: none;
  width: 100%;
  min-height: 40px;
  resize: none;
  box-sizing: border-box;
  &:hover {
    border: 1px solid #1890ff;
  }
`
const SubmitButton = styled.button`
  text-align: center;
  height: 31.1px;
  min-width: 86px;
  color: #52c41a;
  border-color: #52c41a;
  max-width: 78px;
  background-color: #ffff;
  border-radius: 5px;
  font-size: 14px;
  font-family: 'Inter';
  border: 1px solid;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    color: #fff;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #52c41a;
    border-color: #ebeef3;
  }
`

function ArticleComments({ slug }: IArticleCommentsProps) {
  const dispatch = useDispatch<AppDispatch>()
  const comments = useSelector(selectCommentsBySlug(slug)) || []
  const currentUsername = useSelector(selectUsername)
  const [commentBody, setCommentBody] = useState('')
  const loggedUser = useSelector(selectUser)

  useEffect(() => {
    if (!comments.length) {
      dispatch(fetchArticleComments(slug))
    }
  }, [dispatch, slug, comments.length])

  const handleDeleteComment = (commentId: number) => {
    dispatch(fetchDeleteComment({ commentId, slug }))
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(fetchCreateComment({ slug, commentBody }))
    setCommentBody('')
  }

  return (
    <StyledCommentsWrapper>
      <StyledTitle>Комментарии</StyledTitle>
      {comments.length ? (
        comments.map((comment) => (
          <StyledComment key={comment.id}>
            <HeaderWrapper>
              <AuthorWrapper>
                <AuthorImage src={comment.author.image} alt={comment.author.username} />
                <AuthorName>{comment.author.username}</AuthorName>
              </AuthorWrapper>

              <ArticleCreated>{dateFormatter(comment.createdAt)}</ArticleCreated>
            </HeaderWrapper>

            <CommentText>{comment.body}</CommentText>
            {currentUsername === comment.author.username && (
              <DeleteButton onClick={() => handleDeleteComment(comment.id)}>Удалить</DeleteButton>
            )}
          </StyledComment>
        ))
      ) : (
        <StyledNoComments>No comments yet</StyledNoComments>
      )}

      {loggedUser && (
        <CommentForm onSubmit={handleSubmitComment}>
          <CommentTextarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} />
          <SubmitButton type="submit">Отправить</SubmitButton>
        </CommentForm>
      )}
    </StyledCommentsWrapper>
  )
}
export default ArticleComments
