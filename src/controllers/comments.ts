import { Request, Response } from 'express'
import Comment, { IComment } from '../models/Comment'

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('USER', req.user)

    await Comment.create({
      comment: req.body.comment,
      likes: 0,
      post: req.params.id,
    })
    console.log('comment has been created')
    res.redirect(`/post/${req.params.id}`)
  } catch (e) {
    console.error('Error creating comment:', e)
    res.status(500).send('Server Error')
  }
}
