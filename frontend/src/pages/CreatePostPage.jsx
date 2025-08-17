import { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import posting from "../assets/loading.gif";

export default function CreatePostPage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading , setLoading] = useState(false); 
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("userId", user.id);
    formData.append("name", user.username); 


    if(formData.image === null) {
      setLoading(false);
    }else {
      setLoading(true);
    }

    try {
      const res = await axios.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Post created:", res);
      navigate("/home");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }
  };

  return (
 <div className="max-w-xl md:mx-auto p-10 mb-10 mt-5 md:mt-50 md:border border-gray-300 md:shadow-xl rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center">Create Post</h2>

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="rounded-xl w-full h-64 object-cover" />
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
       {preview ? '' : (
          <label className="flex p-10 border border-gray-300 rounded-xl items-center justify-center gap-2 cursor-pointer text-blue-500">
          <span>Upload Image</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
       )}

        <textarea
          rows="3"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition duration-200"
        >
          {loading ? "Posting..." : "Post"}
        </button>
        {loading === true ? (
          <img className="w-30 mx-auto" src={posting} alt="" />
        ) : null}
      </form>
    </div>
  );
}
