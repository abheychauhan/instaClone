import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [followId , setFollowId] = useState([]);
  const user = useSelector((state) => state.user.currentUser);



  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`/users/${user.id}/suggestions`);

        const randomSuggestions = res.data.sort(() =>0.5-Math.random()).slice(0, 10);
        setSuggestions(randomSuggestions);
        console.log("Fetched suggestions:", randomSuggestions);
      } catch (err) {
        console.error("Failed to load suggestions", err);
      }
    };
    console.log("Current User in Suggestions:", user);

    if (user?.id) fetchSuggestions();
  }, [user]);

  const handleFollow = async (followId) => {
    try {
       await axios.post(`/users/${user.id}/follow/${followId}`);
       setFollowId((prev) => [...prev, followId]);
      setTimeout(() => {
          setSuggestions((prev) => prev.filter((u) => u._id !== followId));
    }, 4000);
    } catch (err) {
      console.error("Failed to follow user", err);
    }
  };

  return (
    <div className="h-fit max-w-l lg:fixed right-10  p-4 border-2 border-gray-300  rounded-xl  p-4 bg-white">
      <h2 className="font-bold text-lg mb-3">Suggestions to follow</h2>
      {suggestions.length === 0 ? (
        <p>No suggestions</p>
      ) : (
        suggestions.map((sugg) => (
          <div key={sugg._id} className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-5">
              <img
                src={`${sugg.avartar || "https://static.vecteezy.com/system/resources/thumbnails/020/911/732/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"}`}
                alt="avatar"
                className="w-8 h-8 bg-gray-300 rounded-full"
              />
              <p className="font-medium">{sugg.username}</p>
            </div>
            <button
              onClick={() => handleFollow(sugg._id)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
            >
              {followId.includes(sugg._id) ? "Following" : "Follow"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
