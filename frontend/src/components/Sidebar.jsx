import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const User = useSelector((state)=>state.user.currentUser)
  const id = User.id;
  if (!id) return null;


  const navItems = [
    { label: "Home", path: "/home" ,icon : "ri-home-4-line" },
    { label: "Search", path: "/search" ,icon : "ri-search-2-line" },
    { label: "Create Post", path: "/create",icon : "ri-add-circle-line" },
    { label: "Messages", path: "/msgs",icon : "ri-chat-3-line" },
    { label: "Profile", path: "/profile" ,icon : "ri-account-circle-line"},
    { label: "Settings", path: "/settings",icon : "ri-settings-4-line" },
    { label: "About", path: "/about", icon : "ri-menu-4-fill" },
  ];

  return (
  <>
      {/* Sidebar */}
      <div className={` fixed top-0 left-0 h-full   p-4 lg:w-64 md:w-fit  z-50 transform transition-all duration-200 ease-in-out border-r-2 border-gray-200 ${open ? 'bg-gray-300 md:translate-x-0 sm:translate-x-85 translate-x-30 ' : 'translate-x-186'} md:translate-x-0`}>
        <div className="flex justify-between items-center m-8">
          <h2 className="text-2xl font-semibold md:hidden lg:block ">Instagram</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <p>close</p>
          </button>
        </div>
        <nav className="w-fit flex flex-col gap-2">
          {navItems.map((item) => {
          if (item.label === "Profile") {
            return (
              <Link
                key={item.path}
                to={`${item.path}/${id}`}
                onClick={() => setOpen(false)}
                className={`block py-2 px-3 rounded transition flex gap-4 items-center justify-left ${
                  location.pathname === `${item.path}/${User.id}`
                    ? 'bg-gray-200 font-semibold'
                    : 'hover:bg-gray-200'
                }`}
              >
                <i className={`text-2xl ${item.icon}`}></i>
                <span className='md:hidden lg:block'>{item.label}</span>
              </Link>
            );
          } else if (item.label === "Messages") {
            return (
              <Link
                key={item.path}
                to={`${item.path}`}
                onClick={() => setOpen(false)}
                className={`block py-2 px-3 rounded transition flex gap-4 items-center justify-left ${
                  location.pathname === item.path
                    ? 'bg-blue-200 font-semibold'
                    : 'hover:bg-blue-100'
                }`}
              >
                <i className={`text-2xl ${item.icon}`}></i>
                <span className='md:hidden lg:block'>{item.label}</span>
              </Link>
            );
          } else {
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block py-2 px-3 rounded transition flex gap-4 items-center justify-left ${
                  location.pathname === item.path
                    ? 'bg-gray-200 font-semibold'
                    : 'hover:bg-gray-200'
                }`}
              >
                <i className={`text-2xl ${item.icon}`}></i>
                <span className='md:hidden lg:block'>{item.label}</span>
              </Link>
            );
          }
        })}

        </nav>
      </div>

      {/* Hamburger Button */}
      <button
        className={` md:hidden ${open ? "hidden" : ""}    fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded z-99 `}
        onClick={() => setOpen(true)}
      >
        <p>menu</p>
      </button>
</>
  );
}
