import axios from '../utils/axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function FollowList({id , setShowfollowers}) {

  const [followers , setfollowers] = useState([])
  const [followings , setfollowings] = useState([])
  const user = useSelector((state) => state.user.currentUser);
    const [folloId , setfolloId] = useState([])
  



    useEffect(() => {

    const fetchFollowData = async () => {
    try {
      const followersRes = await axios.get(`/users/${id}/followers`);
      const followingsRes = await axios.get(`/users/${id}/followings`);
      const currentUserFollowingsRes = await axios.get(`/users/${user.id}/followings`);

      setfollowers(followersRes.data);
      setfollowings(followingsRes.data);

      setfolloId(currentUserFollowingsRes.data.map((u) => u.id));
    } catch (err) {
      console.error('Error fetching follow list:', err);
    }
  };
  fetchFollowData();
}, [id , user.id]);

console.log("followId",folloId)

const handleFollow = async (Id) => {
    if (!user?.id) {
    console.warn("User ID not available");
    return;
  }
    try {
      const isFollowing = folloId.includes(Id);
        if (isFollowing){
        await axios.post(`/users/${Id}/unfollow`, { userId: user.id });
        setfollowings((prev) => prev.filter((f) => f.id !== Id));
        }else{
        await axios.post(`/users/${user.id}/follow/${Id}`);
        setfolloId((prev) => [...prev, Id]);
        }

    } catch (err) {
        console.error("Failed to follow user", err);
    }
};


console.log("followers",followers)
console.log("following",followings)


  return  (
    <div className='followlist fixed md:max-h-150 overflow-y-auto scrollbar-hidden overflow-x-hidden flex gap-5 md:gap-10 md:flex-row flex-col   top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   w-fit md:w-150  bg-white border border-gray-300 p-10 rounded-xl c transition-all duration-500 ease-in-out z-50'>
        
         {followers.length > 0 && 
         (
             <div className='flex flex-col gap-5'>
               <p className='font-semibold'>Followers</p>
               {followers.map((f)=>(
                <div key={f.id} className='flex w-54 items-center justify-between'>
                    <Link to={`/profile/${f.id}`} className='cursor-pointer flex gap-3 items-center justify-center'>
                      <img
                       className='w-10 h-10 rounded-full object-cover bg-gray-300'
                       src={f.avatar} alt="avartar" />
                      <h1>{f.username}</h1>
                    </Link>
                     <button
                        onClick={() => handleFollow(f.id)}
                        className={`text-sm  ${folloId.includes(f.id) ? 'bg-white text-gray-800 border border-gray-400' : 'bg-blue-500 text-white' } px-3 py-1 rounded`}
                        >
                        {folloId.includes(f.id) ? "Following" : "Follow"}
                    </button>
                </div>
               ))}

            </div>
         )}

        <div className=' w-[2px] bg-gray-300'></div>


        {followings.length > 0 && (
            <div className='flex flex-col gap-5 '>
            
               <p className='font-semibold'>Followings</p>
               {followings.map((f)=>(
                <div key={f.id} className='flex w-54  items-center justify-between'>
                    <div className='flex gap-3 items-center justify-center'>
                      <img
                       className='w-10 h-10 rounded-full bg-gray-300 object-cover'
                       src={f.avatar} alt="avartar" />
                      <h1>{f.username}</h1>
                    </div>
                    <button
                        onClick={() => handleFollow(f.id)}
                        className={`text-sm  ${folloId.includes(f.id) ? 'bg-white text-red-500 border border-gray-400' : 'bg-blue-500 text-white' } px-3 py-1 rounded`}
                        >
                        {folloId.includes(f.id) ? "unfollow" : "Follow"}
                    </button>
                </div>
               ))}
                
            </div>
        )}


          <button
                onClick={() => setShowfollowers(false)}
                className="absolute  top-[5%] right-[5%] cursor-pointer text-gray-500 font-bold text-xl"
              >
                ✕
              </button>
            
         
    </div>
  )
}

export default FollowList