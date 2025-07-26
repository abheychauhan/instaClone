const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image : { type: String },
    caption: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
    }],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;