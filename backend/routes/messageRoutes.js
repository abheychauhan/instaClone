const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const multer = require('multer');
const { storage3 } = require('../config/cloudinary');

const upload = multer({ storage : storage3 });


// ---- Send a Message ---- //
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
  
    console.log("file:",req.file)
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      fileUrl: req.file?.path || null,
      fileType: req.fileType || null, 
    });
    console.log('filepath:',req.file)

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// ---- Get All Messages Between Two Users ---- //
router.get('/:currentUserId/:selectedUserId', async (req, res) => {
  const { currentUserId, selectedUserId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
});

// ---- Mark Messages as Seen ---- //
router.put('/seen', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    await Message.updateMany(
      { senderId, receiverId, seen: false },
      { $set: { seen: true } }
    );
    res.status(200).json({ message: 'Messages marked as seen' });
  } catch (err) {
    console.error('Seen update error:', err);
    res.status(500).json({ message: 'Error updating seen status' });
  }
});

module.exports = router;
