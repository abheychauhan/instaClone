const Story = require('../models/Story')
const User = require('../models/User')
const express = require('express')
const router = express.Router();
const multer = require('multer');
const { storage2 } = require('../config/cloudinary');

const upload = multer({ storage:storage2 });






router.post("/", upload.single("media"), async (req, res) => {
  try {
    const {userId} = req.body
    const isVideo = req.file.mimetype.startsWith("video");

    const story = new Story({
      userId,
      mediaUrl: req.file.path,
      mediaType: isVideo ? "video" : "image"
    });

    const saved = await story.save();
    await User.findByIdAndUpdate(userId, {
      $push: { stories: saved._id }
    });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload story" });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("userid:",userId)

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingIds = currentUser.following || [];

    const storyUsers = [...followingIds, userId];

    const stories = await Story.find({ userId: { $in: storyUsers } })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.json(stories);
  } catch (err) {
    console.error("Fetch stories error:", err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

module.exports = router;
