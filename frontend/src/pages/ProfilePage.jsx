import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import PostComments from "../components/PostComments";
import FollowList from "../components/FollowList";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const {id} = useParams()
  const user = useSelector((state) => state.user.currentUser);
  const [folloId , setfolloId] = useState([])
  console.log("Current user:", user);
  
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState({ });
  const [commentTrigger, setCommentTrigger] = useState(true);
  const [showfollowers, setShowfollowers] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/users/${id}`);
        setUserData(res.data);
        console.log("profile:",res.data)
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();

       (async () => {
        try {
          const res = await axios.get(`/posts/${id}`);
          setPosts(res.data);
          console.log("Fetched posts:", res.data);
        } catch (err) {
          console.error("Failed to fetch posts:", err);
        }
      })();

      const fetchFollowData = async () => {
          try {

            const currentUserFollowingsRes = await axios.get(`/users/${user.id}/followings`);
      
      
            setfolloId(currentUserFollowingsRes.data.map((u) => u.id));
          } catch (err) {
            console.error('Error fetching follow list:', err);
          }
        };
        fetchFollowData();
  }, [ id , commentTrigger]);


const handleFollow = async () => {
    if (!user?.id) {
    console.warn("User ID not available");
    return;
  }
    try {
      const isFollowing = folloId.includes(id);
        if (isFollowing){
        await axios.post(`/users/${id}/unfollow`, { userId: user.id });
        }else{
        await axios.post(`/users/${user.id}/follow/${id}`);
        setfolloId((prev) => [...prev, id]);

        }
        window.location.reload()

    } catch (err) {
        console.error("Failed to follow user", err);
    }
};


      const handleLike = async (postId) => {
          try {
              const res = await axios.post(`/posts/${postId}/like`, {
                  userId: user.id,
              });
              console.log(res.data)
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
      console.log("Sending comment:", {comment});
  
  
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
      setCommentTrigger(!commentTrigger);
  
      // Clear that specific post's comment input
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




  if (!userData) return <div className="p-8">Loading...</div>;

  return (
    <div className=" mx-auto w-full  p-10 bg-white">
      <div className="flex items-top gap-4 mb-6">
        <img
          src={userData.avartar || "https://static.vecteezy.com/system/resources/thumbnails/020/911/732/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"}
          alt="Avatar"
          className="w-20 h-20 bg-gray-300 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{userData.username}</h2>
          <p className="text-gray-600">{userData.bio || "No bio provided"}</p>
          <div onClick={()=>(setShowfollowers(true))} className="cursor-pointer flex gap-4 mt-2 text-sm text-gray-700">
            <span><b>{userData.followers.length}</b> Followers</span>
            <span><b>{userData.following.length}</b> Following</span>
          </div>
          {showfollowers && (<FollowList id={id} setShowfollowers={setShowfollowers} />)} 
          <div className={`flex ${user.id === id ?"hidden":""} gap-2 mt-5`}>
            <button onClick={handleFollow} className={`px-4 py-1  bg-blue-500 ${folloId.includes(id) ? "bg-white border text-black" : "text-white"} rounded-2xl`}>{folloId.includes(id) ? "following" :"follow"}</button>
            <Link to={`/msgs/`} className="px-4 py-1 border rounded-2xl">message</Link>
          </div>
        </div>
      </div>



      <h3 className="text-xl font-semibold mb-4">Posts</h3>
      <div className="flex gap-10 flex-wrap">
        {userData.posts.length === 0 ? (
          <p className="col-span-full text-gray-500">No posts yet</p>
        ) : (
          posts.map((post) => (
                    <div key={post._id} className="mb-6 w-fit  border-2 border-gray-300  rounded-xl  p-4 bg-white">
                        <img src={post.image} alt="Post" className="w-full h-40  object-cover rounded mb-2" />
                        <p className="font-medium text-gray-600 mb-2">{post.caption}</p>
    
                        {/* Like Button */}
                        <button
                            className="text-blue-600 font-semibold mb-2"
                            onClick={() => handleLike(post._id)}
                        >
                            ❤️ {post.likes.length} {post.likes.includes(user.id) ? "Unlike" : "Like"}
                        </button>
    
                        {/* Comments List */}
                        <div className="mb-2">
                           <PostComments post={post} user={user} handleDeleteComment={handleDeleteComment} />
                        </div>
    
                        {/* Add Comment Input */}
                        <div className="flex w-fit gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment"
                                value={commentInput[post._id]?.text || ""}
                                onChange={(e) =>
                                    setCommentInput((prev) => ({
                                        ...prev,
                                        [post._id]: {
                                            userId: user.id,
                                            text: e.target.value,
                                        },
                                    }))
                                }
                                className="flex-grow border px-2 py-1 rounded"
                            />
                            <button
                                onClick={() => handleComment(post._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                ))
        )}
      </div>
    </div>
  );
}
