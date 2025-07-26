const mongoose = require('mongoose');


const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' }
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;