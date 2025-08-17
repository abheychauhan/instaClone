import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import axios from '../utils/axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Messenger = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({
    username :'',
    avatar : ''
  });
 const navigate = useNavigate()
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
  const fetchUsers = async () => {
    const res = await axios.get(`/users/${id}/followings`);
    const fetchedUsers = res.data.filter((user) => user.id !== id);

    const savedOrder = JSON.parse(localStorage.getItem("userOrder"));

    if (Array.isArray(savedOrder)) {
      const idToUser = {};
      fetchedUsers.forEach((u) => {
        idToUser[u.id] = u;
      });

      const orderedUsers = savedOrder.map(id => idToUser[id]).filter(Boolean);
      const newUsers = fetchedUsers.filter(u => !savedOrder.includes(u.id));

      setAllUsers([...orderedUsers, ...newUsers]);
    } else {
      setAllUsers(fetchedUsers);
    }
  };

  fetchUsers();
}, [id]);

const moveToTop = (userId) => {
  const updated = [...allUsers];
  const index = updated.findIndex((u) => u.id === userId);
  if (index !== -1) {
    const [userToMove] = updated.splice(index, 1);
    const newOrder = [userToMove, ...updated];
    setAllUsers(newOrder);
    localStorage.setItem("userOrder", JSON.stringify(newOrder.map(u => u.id)));
  }
};



  return (
    <div className="flex h-screen bg-gray-100  ">
      {/* Left sidebar: Users List */}
      <div className={`md:w-1/4 w-full md:block  border-r p-4 overflow-y-auto ${open ? "hidden" : ""}`}>
        <div className='flex items-center h-fit w-fit gap-2 mb-5'>
          <button className="md:hidden" onClick={() => (navigate('/home')) }>
            <i className="text-2xl ri-arrow-left-line"></i>
          </button>
          <h2 className="font-bold">Chats</h2>

        </div>
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
          <ChatBox currentUserId={id} selectedUserId={selectedUser} selectedUser={selectedUserData} setOpen={setOpen}  moveToTop={moveToTop} />
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
