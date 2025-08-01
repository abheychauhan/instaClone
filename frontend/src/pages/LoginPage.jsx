import { useState } from "react";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("/auth/login", form, {
        withCredentials: true
      });
      dispatch(loginSuccess(res.data.user));
      console.log(res)
      navigate("/home");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          placeholder="Email"
          className="w-full mb-3 border outline-blue-500 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 border outline-blue-500 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-500 w-full text-white active:bg-blue-300 p-2 rounded">
          Login
        </button>
        <Link to='/register' className="block text-center mt-2 w-full text-blue-500">Create new acoount here.</Link>
      </form>
      
    </div>
  );
}
