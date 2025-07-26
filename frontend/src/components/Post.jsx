import { useState } from "react";
import axios from "../utils/axios";

export default function Post({ post, currentUser }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");

  const toggleLike = async () => {
    const res = await axios.put(`/posts/${post._id}/like`, {
      userId: currentUser._id,
    });
    setLikes(res.data);
  };

  const addComment = async () => {
    const res = await axios.post(`/posts/${post._id}/comment`, {
      userId: currentUser._id,
      text: commentText,
    });
    setComments(res.data);
    setCommentText("");
  };

  return (
    <div className="border p-4 mb-4 rounded-md">
      <h3 className="font-bold">{post.user.username}</h3>
      <img src={post.image} className="w-full h-80 object-cover my-2" />
      <p>{post.caption}</p>
      <button onClick={toggleLike}>
        ❤️ {likes.length}
      </button>
      <div className="mt-2">
        {comments.map((c, i) => (
          <p key={i}><b>{c.user}</b>: {c.text}</p>
        ))}
      </div>
      <input
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="border p-1 mt-1 w-full"
      />
      <button onClick={addComment}>Post</button>
    </div>
  );
}
