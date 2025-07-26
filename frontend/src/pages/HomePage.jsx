import React from 'react'
import { useSelector } from 'react-redux'
import Allpost from '../components/Allpost'
import Suggestions from '../components/Suggestions'
import AddStory from '../components/AddStory'
import Story from '../components/Story'

function HomePage() {

    const user = useSelector(state => state.user.currentUser)
    console.log("Current User:", user)
    return (
        <div className=" min-h-screen w-full flex flex-col">
            <div className=' w-full flex flex-col '>
            <div className='fixed z-50 bg-white w-full p-6'>
            <h1 className="text-2xl font-bold">Welcome, {user?.username || "Guest"} 👋</h1>
           <div className='flex items-center'>
            <AddStory/>
            <Story/>
           </div>
            </div>
            <div className='flex mt-50 p-10 gap-20 lg:flex-row flex-col  justify-between w-full'>
             <Allpost/>
             <Suggestions/>

            </div>
            </div>
        </div>
    )
}

export default HomePage