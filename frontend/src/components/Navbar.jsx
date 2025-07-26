import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [log, setlog] = useState(false)

  useEffect(()=>{
    if(log){
      window.location.reload();

    }
  },[log])
  const logoutHandler = () => {
    dispatch(logout());
    setlog(!log);
  }

  return (
    <div className=" shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">InstaLite</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hi, {user.username}</span>
            <button
              onClick={() => logoutHandler()}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 text-blue-600">Login</Link>
            <Link to="/register" className="text-green-600">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
