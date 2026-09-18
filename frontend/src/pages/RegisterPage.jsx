import axios from "../utils/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";
import loadingImg from "../assets/loading.gif";


export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);



  const handleRegister = async (e) => {
    try {
      setLoading(true)
      e.preventDefault();
      const res = await axios.post("/auth/register", form);
      console.log(res.data);
      dispatch(loginSuccess(res.data.user));
      console.log("User registered successfully");


      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    }
    finally {
      setLoading(false)
    }
  };

  console.log(form);
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
      <div className={`w-fit h-fit absolute ${loading ? "block" : "hidden"} flex justify-center items-center`}>
        <img className="w-20" src={loadingImg} alt="Loading..." />
      </div>
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          required
          placeholder="Username"
          className="w-full mb-3 border outline-blue-400 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          required
          placeholder="Email"
          className="w-full mb-3 border outline-blue-400 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required

          type="password"
          placeholder="Password"
          className="w-full mb-3 border outline-blue-400 border-gray-400 hover:border-blue-500 p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-green-500 active:bg-green-400  w-full text-white p-2 rounded">
          Register
        </button>
        <Link to='/login' className="block text-center mt-2 w-full text-blue-500">Have account, Login here.</Link>
      </form>
    </div>
  );
}
