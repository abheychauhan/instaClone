import { useState } from "react";

function PostComments({ post, user, handleDeleteComment ,commentInput, setCommentInput , handleComment }) {
  const [showAllComments, setShowAllComments] = useState(false);

  return (
    <div className="">
      <button onClick={()=>setShowAllComments(true)} className="flex items-center">
         <i className="ri-chat-3-line text-2xl "></i>
         {post.comments.length > 0 ? <span>{post.comments.length}</span> :"" }
         
      </button>


      {/* {post.comments.length > 0 &&
        post.comments.slice(0,1).map((c, i) => (
          <p key={i} className="text-sm text-gray-600">
            <span>
              <b>{c.username || "Unknown"}:</b> {c.text}
              {c.userId === user.id && (
                <button
                  onClick={() => handleDeleteComment(post._id, c._id)}
                  className="text-red-500 text-xs ml-2"
                >
                  Delete
                </button>
              )}
            </span>
          </p>
        ))}

      {post.comments.length > 1 && (
        <button
          onClick={() => setShowAllComments(true)}
          className="text-blue-500 text-sm hover:underline"
        >
          See more...
        </button>
      )} */}

      {/* Modal-like card for all comments */}
      {showAllComments && (
        <div className="fixed inset-0  bg-opacity-0 z-50 flex items-center justify-center p-4 ">
          <div className="bg-white w-full border border-gray-400 max-w-md rounded-xl shadow-lg p-4 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">All Comments</h2>
              <button
                onClick={() => setShowAllComments(false)}
                className="text-red-500 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {post.comments.map((c, i) => (
              <p key={i} className="text-sm text-gray-700 mb-2">
                <b>{c.username || "Unknown"}:</b> {c.text}
                {c.userId === user.id && (
                  <button
                    onClick={() => handleDeleteComment(post._id, c._id)}
                    className="text-red-500 text-xs ml-2"
                  >
                    Delete
                  </button>
                )}
              </p>
            ))}
             <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment"
                                value={commentInput[post._id]?.text || ""}
                                onChange={(e) =>
                                    setCommentInput((prev) => ({
                                        ...prev,
                                        [post._id]: {
                                            userId: user.id,
                                            text: e.target.value,
                                        },
                                    }))
                                }
                                className="flex-grow border px-2 py-1 rounded"
                            />
                            <button
                                onClick={() => handleComment(post._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Post
                            </button>
                        </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostComments;
