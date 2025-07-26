const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  fileUrl: String,
  fileType: {
    type: String,
    enum: ['image', 'video', 'pdf', null],
    default: null
  },
  seen: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;