import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Cookies from 'js-cookie';

function LandingPage() {

  const token = sessionStorage.getItem('user');
  console.log(token)
  return (

    <div>
      <div className="min-h-screen w-screen bg-gradient-to-br from-pink-300 via-white to-blue-300 ">
        <Navbar />
        <div className='w-full flex  flex-col items-center justify-center mt-10'>

          <div className="text-center mb-12 ">
            <h1 className="text-6xl font-extrabold text-pink-600 mb-4">InstaLite</h1>
            <p className="text-gray-600 text-lg">Share your moments, connect with the world.</p>
          </div>

          <div className="grid grid-cols-1 mb-12">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png"
              alt="Insta Icon"
              className="w-44 h-44 lg:w-64 lg:h-64 object-contain rounded-xl shadow-lg"
            />

          </div>

          <div >
            {token ? (<Link to="/home" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">Go to Home</Link>) : (
              <div className="space-x-4">
                <Link to="/login">
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 shadow">
                    Register
                  </button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage