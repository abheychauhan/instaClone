import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import axios from "../utils/axios";


function ChatBox({ currentUserId, selectedUserId ,selectedUser ,setOpen ,moveToTop}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [userSeen, setUserSeen] = useState(false);
  const [modal, setModal] = useState(null);
  const scrollRef = useRef(null);
  console.log("sles",selectedUser)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/msgs/${currentUserId}/${selectedUserId}`);
        setMessages(res.data);
        setUserSeen(res.data[res.data.length - 1]?.seen);
        markMessagesAsSeen(res.data);

        socket.on("messageSeen", (data) => {
          if (data.senderId === currentUserId && data.receiverId === selectedUserId) {
            setUserSeen((prev) => !prev);
          }
        });

        return () => socket.off("messageSeen");
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedUserId, userSeen]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data.senderId === selectedUserId) {
        setMessages((prev) => [...prev, data]);
        markMessagesAsSeen([data]);
      }
    });

    return () => socket.off("getMessage");
  }, [selectedUserId]);

  const markMessagesAsSeen = async (msgs) => {
    const unseen = msgs.filter((m) => !m.seen && m.receiverId === currentUserId);
    if (unseen.length) {
      await axios.put("/msgs/seen", {
        senderId: selectedUserId,
        receiverId: currentUserId,
      });
      socket.emit("messageSeen", {
        senderId: selectedUserId,
        receiverId: currentUserId,
      });
      setUserSeen((prev) => !prev);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    const formData = new FormData();
    formData.append("senderId", currentUserId);
    formData.append("receiverId", selectedUserId);
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("/msgs", formData);
      setMessages([...messages, res.data]);
      socket.emit("sendMessage", res.data);
      setText("");
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error("Send error:", err);
    }

    if (typeof moveToTop === "function") {
      moveToTop(selectedUserId); // 👈 Move to top after sending
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected && selected.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col  rounded shadow p-4 relative ">
      <div className="w-full flex items-center gap-1 mb-2">
        <i onClick={()=>setOpen(false)} className={` md:hidden text-xl ri-arrow-left-line`}></i>
        <img  className='w-11 rounded-full p-1' src={selectedUser.avatar} alt="" />
        <span className="font-semibold">{selectedUser.username}</span>
      </div>
      {/* Fullscreen Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setModal(null)}
        >
          {modal.type === "image" ? (
            <img src={modal.url} className="max-w-full max-h-full" />
          ) : modal.type === "video" ? (
            <video src={modal.url} controls className="max-w-full max-h-full" />
          ) : (
            <iframe src={modal.url} className="w-4/5 h-4/5 bg-white rounded" />
          )}
          <a
            href={modal.url}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 text-white bg-blue-500 px-4 py-2 rounded"
          >
            Download
          </a>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto gap-1 py-4 scrollbar-hide flex flex-col">
        {messages.map((msg, i) => (
          <div
            key={i}
            ref={i === messages.length - 1 ? scrollRef : null}
            className={`max-w-xs px-3 py-2 rounded-lg break-words ${
              msg.senderId === currentUserId ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}

            {msg.fileUrl && (
              <div
                onClick={() => setModal({ url: msg.fileUrl, type: msg.fileType })}
                className="cursor-pointer mt-1"
              >
                {msg.fileType === "image" ? (
                  <img src={msg.fileUrl} className="w-32 h-32 object-cover rounded" />
                ) : msg.fileType === "video" ? (
                  <video src={msg.fileUrl} className="w-32" controls />
                ) : msg.fileType === "pdf" ? (
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View PDF
                  </a>
                ) : null}
              </div>
            )}

            {i === messages.length - 1 &&
              msg.senderId === currentUserId && (
                <span className="text-xs text-gray-500 block mt-1">
                  {msg.seen && userSeen ? "Seen" : "Delivered"}
                </span>
              )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="mt-4 w-full flex gap-2 items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border  p-2 flex-1 rounded"
          placeholder="Type a message..."
        />
        <label className="">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <i className="ri-upload-2-line text-2xl border p-1 rounded"></i>
        </label>
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>

      {/* Image preview before sending */}
      {filePreview && (
        <div className="mt-2 self-start">
          <img src={filePreview} className="w-24 rounded border" alt="preview" />
        </div>
      )}
    </div>
  );
}

export default ChatBox;
