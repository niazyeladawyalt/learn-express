import express, { NextFunction, Request, Response } from 'express';
import { createPost, deletePost, getPosts, getSinglePost, updatePost } from '../controllers/feed';
import { careatePostValidationRules, updatePostValidationRules } from '../validators/feed';
import { isAuth } from '../middleware/is-auth';

const router = express.Router();

router.get('/posts', isAuth, getPosts);
router.get('/post/:id', isAuth, getSinglePost);
router.patch('/post/:id', isAuth, updatePostValidationRules, updatePost);
router.delete('/post/:id', isAuth, deletePost);
router.post('/post', isAuth, careatePostValidationRules, createPost);

export default router;
