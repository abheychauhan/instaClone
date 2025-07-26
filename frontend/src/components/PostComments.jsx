import { useState } from "react";

function PostComments({ post, user, handleDeleteComment }) {
  const [showAllComments, setShowAllComments] = useState(false);

  return (
    <div className="mb-2">
      <p className="font-semibold text-gray-700 mb-1">Comments:</p>

      {post.comments.length > 0 &&
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
      )}

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
          </div>
        </div>
      )}
    </div>
  );
}

export default PostComments;
