import React, { useState } from 'react'
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Load from '../assets/loading.gif'

function AddStory() {
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate()
  const [open, setopen] = useState(true);
  const [loading, setloading] = useState(false);


console.log(open)
  const user = useSelector((state)=>state.user.currentUser)


    const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  const uploadStory = async () => {
    const formData = new FormData();
    formData.append("media", media);
    formData.append("userId", user.id);
    setloading(true)

    await axios.post("/stories", formData );
    window.location.reload()
    navigate('/home')
    console.log(media)
    setMedia(null)
  };

  return (
    <div className=' p-2'>
      <label onClick={()=>(setopen(true))} className='cursor-pointer' > <i className="ri-add-line  px-6 py-5 text-3xl   border border-gray-400 text-gray-400 rounded-full flex flex-col"></i>
      <input className='hidden' type="file" accept="image/*,video/*" onChange={handleImageChange} />
      </label>
      <span className='text-sm'>Add to story</span>


      {
        media && open  ? <div className='fixed h-full w-full  top-0 left-0 flex items-center justify-center p-4 bg-black '>
          <div className='relative h-full max-w-xl flex item-center p-2 bg-gray-300 rounded-xl'>
           <img className='h-full w-full object-contain' src={preview} alt="story" />
          <button className='absolute bottom-10 right-10 rounded-xl active:bg-blue-300 bg-blue-500 text-white p-3' onClick={uploadStory}>Upload Story</button>
          <span className='absolute top-10 right-10' onClick={()=>(setopen(false))}><i className="ri-close-fill text-gray-100 text-5xl"></i></span>
            {loading &&
              <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <img className='w-30' src={Load} alt="loading" />
              </div>
            }
          </div>
        </div> : ""
      }

    </div>
  );
}

export default AddStory