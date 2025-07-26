import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import axios from '../utils/axios';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Messenger = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({
    username :'',
    avatar : ''
  });

  const [open, setOpen] = useState(false);

  const user = useSelector((state)=>state.user.currentUser)
  console.log(user)
  const handelSetting =(user)=>{
    setSelectedUser(user.id)
    setSelectedUserData({
      username : user.username,
      avatar:user.avatar
    })
    setOpen(true)
  }
 const id = user.id
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
    <div className="flex h-screen bg-gray-100  ">
      {/* Left sidebar: Users List */}
      <div className={`md:w-1/4 w-full md:block  border-r p-4 overflow-y-auto ${open ? "hidden" : ""}`}>
        <h2 className="font-bold mb-4">Chats</h2>
        {allUsers.map((user) => (
          <div
            key={user.id}
            className={`p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 ${
              selectedUser?.id === user.id ? 'bg-gray-300' : ''
            }`}
            onClick={() => handelSetting(user)}
          >
            <img className='w-10 p-1 rounded-full border' src={user.avatar} alt="" />
            {user.username}
          </div>
        ))}
      </div>

      {/* Right: ChatBox */}
      <div className={`md:w-3/4 w-full  md:block ${open ? 'block' : "hidden"}`}>
        {selectedUser ? (
          <ChatBox currentUserId={id} selectedUserId={selectedUser} selectedUser={selectedUserData} setOpen={setOpen} />
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
