const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require("multer");
const {storage1} = require("../config/cloudinary")

const upload = multer({ storage: storage1 });








//search user
router.get("/search", async (req, res) => {
  const query = req.query.username;
  if (!query) {
    return res.status(400).json({ message: "Username query is required" });
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avartar _id");

    res.status(200).json(users);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Get User Profile
router.get('/:id' , async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v')
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Profile
router.put('/update/:id',upload.single('avatar'), async (req, res) => {
    try {
      console.log("Body:", req.body);
      console.log("File:", req.file);

        const { username, email, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, bio, avartar:req.file.path },
            { new: true, runValidators: true }
        ).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



//suggest users to follow
router.get('/:id/suggestions', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const following = currentUser.following.map(id => id.toString());

    const suggestions = await User.find({
      _id: { $ne: currentUser._id, $nin: following },
    }).select('username avatar'); // get only necessary fields

    res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error suggesting users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Follow User
router.post("/:id/follow/:followId", async (req, res) => {
    try {
        const currentUserId = req.params.id;
        const userToFollow = await User.findById(req.params.followId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userToFollow.followers.includes(currentUserId)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }
        await userToFollow.updateOne({ $push: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $push: { following: req.params.followId } });
        res.status(200).json({ message: 'User followed successfully' });
    } catch (err) {
        console.error('Error following user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unfollow User
router.post('/:id/unfollow', async (req, res) => {
    try {
        const currentUserId = req.body.userId;  
        const userToUnfollow = await User.findById(req.params.id);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!userToUnfollow.followers.includes(currentUserId)) {
            return res.status(400).json({ message: 'You are not following this user' });    
        }

        await userToUnfollow.updateOne({ $pull: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $pull: { following: req.params.id } });
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (err) {
        console.error('Error unfollowing user:', err);
        res.status(500).json({ message: 'Server error' });
    }                           
});

//following list

router.get("/:id/followings", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followingList = await Promise.all(
      user.following.map((friendId) => User.findById(friendId))
    );
    const formatted = followingList.map((u) => ({
      id: u._id,
      username: u.username,
      avatar: u.avartar,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Followings fetch error:", error);
    res.status(500).json({ error: "Failed to fetch following list" });
  }
});

router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followerList = await Promise.all(
      user.followers.map((friendId) => User.findById(friendId))
    );
    const formatted = followerList.map((u) => ({
      id: u._id,
      username: u.username,
      avatar: u.avartar,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error("followers fetch error:", error);
    res.status(500).json({ error: "Failed to fetch follower list" });
  }
});






module.exports = router;


