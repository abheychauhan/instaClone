import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import axios from '../utils/axios';
import { useParams } from 'react-router-dom';

const Messenger = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const {id} = useParams()
  console.log(id)

  useEffect(() => {
    // Fetch all users (excluding yourself)
    const fetchUsers = async () => {
      const res = await axios.get(`/users/${id}/followings`);
      console.log("following user:",res.data)
      setAllUsers(res.data.filter((user) => user.id !== id));
    };
    fetchUsers();
  }, [id]);

  return (
    <div className="flex h-screen">
      {/* Left sidebar: Users List */}
      <div className="w-1/4 bg-gray-100 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Chats</h2>
        {allUsers.map((user) => (
          <div
            key={user.id}
            className={`p-2 cursor-pointer hover:bg-gray-200 ${
              selectedUser?.id === user.id ? 'bg-gray-300' : ''
            }`}
            onClick={() => setSelectedUser(user.id)}
          >
            {user.username}
          </div>
        ))}
      </div>

      {/* Right: ChatBox */}
      <div className="w-3/4">
        {selectedUser ? (
          <ChatBox currentUserId={id} selectedUserId={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
