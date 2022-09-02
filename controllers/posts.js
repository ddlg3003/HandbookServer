import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const limit = 3;
        const startIndex = (Number(page) - 1) * limit;
        const total = await PostMessage.countDocuments({});

        const postMessages = await PostMessage.find().sort({ _id: -1 }).limit(limit).skip(startIndex);

        res.status(200).json({ data: postMessages, currentPage: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { query, tags } = req.query;

    try {
        const title = new RegExp(query, 'i'); // DANG dang Dang -> dang

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } }] });
    
        res.json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('No valid id');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('No valid id');

    await PostMessage.findByIdAndRemove(id);
    res.json({ message: 'Post deleted successfully!' });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.status(401).json({ message: 'Unauthenticated!' });
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No valid id');
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1) {
        post.likes.push(req.userId);
    }
    else {
        post.likes = post.likes.filter(id => id !== req.userId);
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true});

    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new:true });

    res.json(updatedPost);
}