import mongoose from 'mongoose';

const postScheme = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    name: String,
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const PostMessage = mongoose.model('PostMessage', postScheme);

export default PostMessage;