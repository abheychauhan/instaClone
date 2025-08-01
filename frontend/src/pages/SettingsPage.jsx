import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { logout } from "../redux/userSlice"; // adjust if different

export default function SettingsPage() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
console.log(user)

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, {
        withCredentials: true,
      });
     dispatch(logout());
     navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }

  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete(`/users/${user.id}`);
        dispatch(logout());
        navigate("/register");
      } catch (err) {
        console.error("Failed to delete account:", err);
      }
    }
  };

const handleUpdate = async (e) => {
  e.preventDefault();
  const form = e.target;

  const formData = new FormData();
  formData.append("username", form.username.value);
  formData.append("email", form.email.value);
  formData.append("bio", form.bio.value);
  formData.append("avatar", form.avatar.files[0]); // ✅ send file as FormData

  try {
    const res = await axios.put(`/users/update/${user.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Profile updated successfully");
    console.log(res.data);
  } catch (err) {
    console.error("Profile update failed:", err);
  }
};

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg border-gray-300 border shadow">
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            name="username"
            defaultValue={user.username}
            className="w-full border px-3 py-2 rounded mt-1 border-gray-300 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={user.email}
            className="w-full border px-3 py-2 rounded mt-1 border-gray-300 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium border rounded-xl w-fit p-5 border-gray-300">Profile Pic
          <input
            name="avatar"
            type="file"
            accept="image/*"
            className="w-full border px-3 py-2 rounded mt-1 hidden"
            required
          />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium ">Bio</label>
          <input
            name="bio"
            type="text"
            defaultValue={user.bio}
            className="w-full border px-3 py-2 rounded mt-1 border-gray-300 border"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
      </form>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
