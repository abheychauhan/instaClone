import axios from "../utils/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("/auth/register", form);
        console.log(res.data);
      dispatch(loginSuccess(res.data.user));
      console.log("User registered successfully");
      
      navigate("/home");
    } catch (err) {
      alert("Registration failed");
        console.error(err);
    }
  };

 console.log(form);
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          placeholder="Username"
          className="w-full mb-3 border outline-blue-400 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Email"
          className="w-full mb-3 border outline-blue-400 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 border outline-blue-400 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button  className="bg-green-500 active:bg-green-400  w-full text-white p-2 rounded">
          Register
        </button>
        <Link to='/login' className="block text-center mt-2 w-full text-blue-500">Have account, Login here.</Link>
      </form>
    </div>
  );
}
