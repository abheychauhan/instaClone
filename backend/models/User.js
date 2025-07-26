const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}, 
  bio: {type: String},
  avartar: {type: String},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    stories:[{type:mongoose.Schema.Types.ObjectId, ref: 'Story'}]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;