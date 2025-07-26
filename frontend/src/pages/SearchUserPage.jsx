import { useState } from "react";
import axios from "../utils/axios"; // adjust path as needed
import { Link } from "react-router-dom";

export default function SearchUserPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get(`/users/search?username=${query}`);
      console.log(res.data)
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Enter username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-3 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {results.length > 0 ? (
        <ul className="space-y-3">
          {results.map((user) => (
            <li key={user._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avartar || "https://static.vecteezy.com/system/resources/thumbnails/020/911/732/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"}
                  alt="avatar"
                  className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                />
                <span className="font-medium">{user.username}</span>
              </div>
              <Link
                to={`/profile/${user._id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View Profile
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        query && <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
