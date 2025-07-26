const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });






// Create a new post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { caption, userId , name } = req.body;

    if (!userId || !req.file?.path) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const newPost = new Post({
      name,
      caption,
      userId,
      image: req.file.path,
    });
    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id }
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all posts
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const posts = await Post.find({userId}).populate("userId", "username").sort({ createdAt: -1 });

    // Manually attach username to each comment
    const postsWithUsernames = await Promise.all(posts.map(async (post) => {
      const commentsWithUsernames = await Promise.all(
        post.comments.map(async (comment) => {
          const user = await User.findById(comment.userId).select("username");
          return {
            ...comment.toObject(),
            username: user?.username || "Unknown",
          };
        })
      );

      return {
        ...post.toObject(),
        comments: commentsWithUsernames,
      };
    }));

    res.json(postsWithUsernames);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});





//get post from all users
router.get('/feed/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingIds = user.following.map(f => f._id);
        followingIds.push(user._id);

        console.log("Following IDs:", followingIds);

        const posts = await Post.find({ userId: { $in: followingIds } })
            .populate('userId', 'username avatar')
            .sort({ createdAt: -1 });

       const postsWithUsernames = await Promise.all(posts.map(async (post) => {
      const commentsWithUsernames = await Promise.all(
        post.comments.map(async (comment) => {
          const user = await User.findById(comment.userId).select("username");
          return {
            ...comment.toObject(),
            username: user?.username || "Unknown",
          };
        })
      );

      return {
        ...post.toObject(),
        comments: commentsWithUsernames,
      };
    }));

    res.json(postsWithUsernames);
    } catch (err) {
        console.error('Error fetching feed:', err); // 👈 will log full error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Like/unlike a post
router.post('/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      // Unlike: remove only current user's like
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like: add current user's like
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(req.params.postId)
      .populate("userId", "username")
      .populate("comments.userId", "username");

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Like failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete a post
router.delete('/:id/delete', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Server error' });
    }

});


// comment on a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId)  
      .sort({ createdAt: -1 }).populate("comments", "username");
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ userId, text });
    await post.save();

    const updatedPost = await Post.findById(postId);

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("🔥 Error commenting on post:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE a comment from a post
router.delete('/:postId/comment/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();



    const updatedPost = await Post.findById(postId)
      .populate("userId", "username")
      .populate("comments", "username");

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;