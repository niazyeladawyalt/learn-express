import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Post from '../models/post';
import User from '../models/user';
import { validationError } from '../utils/error';
import { formatPagination, getPagination } from '../utils/paginate';
import mongoose from 'mongoose';
import { checkPostAuthor } from '../utils/checkAuthorization';
import { getIO } from '../socket';

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    // const posts = await Post.find();
    const [posts, total] = await Promise.all([
      Post.find().skip(skip).limit(limit),
      Post.countDocuments(),
    ]);
    if (posts) {
      res.status(200).json({
        message: 'posts fetched successfully',
        data: posts,
        pagination: formatPagination(total, page, limit),
      });
    }
  } catch (error) {
    next(error);
  }
};

const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid' });
      return;
    }

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    if (post) {
      res.status(200).json({
        post,
      });
    }
  } catch (error) {
    next(error);
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(validationError(errors.array()));
  }

  if (!req.file) {
    const error = new Error('No image provided') as any;
    error.statusCode = 422;
    return next(error);
  }

  const imageUrl = req.file.path;

  try {
    const { title, content } = req.body;

    const post = new Post({ title, content, imageUrl, author: req.userId });
    const savedPost = await post.save();

    const foundUser = await User.findById(req.userId);
    if (!foundUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    foundUser.posts.push(savedPost);
    await foundUser.save();

    getIO().emit('posts', { action: 'create', post: savedPost });

    res.status(201).json({
      message: 'Post created successfully!',
      post: savedPost,
      author: { _id: foundUser._id, name: foundUser.name },
    });
    return;
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation Error') as any;
    error.statusCode = 422;
    error.errors = errors.array(); // Get array form, not the whole result
    return next(error); // 🔑 THIS is the fix
  }

  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (!checkPostAuthor(post.author, req.userId, res)) {
      return; // authorization failed, already responded
    }
    let imageUrl = post.imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;
    const updatedPost = await post.save();

    getIO().emit('posts', { action: 'update', post: updatedPost });

    res.status(200).json({
      message: 'Post updated successfully!',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    if (!checkPostAuthor(post.author, req.userId, res)) {
      return; // authorization failed, already responded
    }
    const result = await Post.findByIdAndDelete(id);
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.posts.pull(id);
    await user.save();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
export { getPosts, createPost, getSinglePost, updatePost, deletePost };
