import { act, useEffect, useState } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import PostComments from "./PostComments";

export default function Allpost() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentInput, setCommentInput] = useState({});
  const [commentTrigger, setCommentTrigger] = useState(false);
  const [active, setActive] = useState(null)



  const user = useSelector((state) => state.user.currentUser);
  useEffect(() => {

    (async () => {
      try {
        const feed = await axios.get(`/posts/feed/${user.id}`);
        setPosts(feed.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    })();

  }, [commentTrigger]);


  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}/delete`)
      setPosts((prev) => prev.filter(post => post._id !== postId))
      setActive(null)
    } catch (error) {
      console.log(error)
    }
  }


  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/posts/${postId}/like`, {
        userId: user.id,
      });
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };


  // Handle adding a comment
  const handleComment = async (postId) => {
    const comment = commentInput[postId];

    if (!comment?.text) return;

    try {
      const res = await axios.post(`/posts/${postId}/comment`, {
        userId: comment.userId,
        text: comment.text,
      });
      console.log("Sending comment:", { comment });


      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
      setCommentTrigger(!commentTrigger);

      setCommentInput((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], text: "" }
      }));
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };


  // Handle deleting a comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(`/posts/${postId}/comment/${commentId}`);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
      setCommentTrigger(!commentTrigger);
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };






  return (
    <div className="max-w-2xl md:px-10 lg:pl-40">
      <h2 className="text-2xl font-bold mb-8">Latest Posts</h2>
      {posts.length === 0 && posts.image ? (
        <p className="text-gray-500">No posts available</p>
      ) : (
        <div>

          {posts.map((post) => (
            <div key={post._id} className="relative bg-red-400 mb-6 border-2 border-gray-300  rounded-xl  px-2 pb-4 bg-white">
              <div className="flex items-center justify-between py-2 ">
                <b className="text-xl">{post.name}</b>
                {
                  post.userId._id === user.id && (
                    <i onClick={() => setActive(prev => (prev === post._id ? null : post._id))} className="ri-more-2-fill text-xl cursor-pointer"></i>
                  )
                }
              </div>

              {active === post._id && post.userId._id === user.id && (
                <div className="absolute bg-white right-2 p-4 flex flex-col gap-2 border w-fit rounded-xl border-gray-300 shadow-md">
                  <h3 className="cursor-pointer">Edit</h3>
                  <h3 onClick={() => { handleDeletePost(post._id) }} className="cursor-pointer">Delete</h3>
                </div>
              )}

              <img src={post.image} alt="Post" className="w-full h-[80%]  object-cover rounded mb-2" />
              <p className="font-medium text-gray-600 mb-2">{post.caption}</p>

              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  className=""
                  onClick={() => handleLike(post._id)}
                >
                  <i className={`ri-heart-line text-2xl ${post.likes.includes(user.id) ? "text-red-500" : "text-black"}`}></i>{post.likes.length}
                </button>

                {/* Comments List */}
                <div className="">
                  <PostComments post={post} user={user} handleDeleteComment={handleDeleteComment} commentInput={commentInput} setCommentInput={setCommentInput} handleComment={handleComment} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
