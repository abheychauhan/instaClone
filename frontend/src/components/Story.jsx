import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { useEffect, useState } from "react";

function Story() {
  const [groupedStories, setGroupedStories] = useState([]); // Stories grouped by user
  const [length , setLength] = useState(null)
  const [activeUserIndex, setActiveUserIndex] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const getStories = async () => {
      const res = await axios.get(`/stories?userId=${user.id}`);
      console.log(res.data)
      setLength(res.data.length)
      
      
      // Group stories by userId
      const groups = res.data.reduce((acc, story) => {
          if (!story.userId || !story.userId._id) {
              return acc; // Skip stories without a valid user
            }

        const id = story.userId._id;
        if (!acc[id]) {
          acc[id] = { user: story.userId, stories: [] };
        }
        acc[id].stories.push(story);
        return acc;
      }, {});
      setGroupedStories(Object.values(groups));
      console.log(groupedStories)
    };
    getStories();
  }, [length]);

  useEffect(() => {
    let interval;
    if (activeUserIndex !== null) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 100;
          }
          return prev + 2;
        });
      }, 100); // 5s timer
    }
    return () => clearInterval(interval);
  }, [activeUserIndex, activeStoryIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeUserIndex !== null) {
        if (e.key === "ArrowRight") {
          handleNextStory();
        } else if (e.key === "ArrowLeft") {
          handlePrevStory();
        } else if (e.key === "Escape") {
          handleCloseStory();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeUserIndex, activeStoryIndex]);

  const handleUserClick = (index) => {
    setActiveUserIndex(index);
    setActiveStoryIndex(0);
  };

  const handleCloseStory = () => {
    setActiveUserIndex(null);
    setActiveStoryIndex(0);
    setProgress(0);
  };

  const handleNextStory = () => {
    const currentUserStories = groupedStories[activeUserIndex].stories;
    if (activeStoryIndex < currentUserStories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
    } else {
      // Move to next user's story
      if (activeUserIndex < groupedStories.length - 1) {
        setActiveUserIndex((prev) => prev + 1);
        setActiveStoryIndex(0);
      } else {
        handleCloseStory();
      }
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    } else if (activeUserIndex > 0) {
      const prevUserIndex = activeUserIndex - 1;
      const prevUserStories = groupedStories[prevUserIndex].stories;
      setActiveUserIndex(prevUserIndex);
      setActiveStoryIndex(prevUserStories.length - 1);
    } else {
      handleCloseStory();
    }
  };

  return (
    <>
      {/* Horizontal Story Avatars */}
      <div className="scrollbar-hide flex overflow-x-scroll gap-4 p-3 ">
        {groupedStories.map((group, index) => (
          <div
            key={group.user._id}
            className="w-24 text-center cursor-pointer flex flex-col items-center"
            onClick={() => handleUserClick(index)}
          >
            <img
              src={group.user.avartar}
              alt="story"
              className="rounded-full h-20 w-20 object-cover border-2 border-pink-500"
            />
            <p className="text-sm mt-1">{group.user.username}</p>
          </div>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {activeUserIndex !== null && (
        <div className="fixed w-full inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center ">
          {/* Top progress bar */}
          

          {/* Media */}
          <div className="md:max-w-[30%] h-full flex items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
            <div
              className="h-full bg-white transition-all duration-100 linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
            {groupedStories[activeUserIndex].stories[activeStoryIndex].mediaType === "image" ? (
              <img
                src={groupedStories[activeUserIndex].stories[activeStoryIndex].mediaUrl}
                alt="story"
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                src={groupedStories[activeUserIndex].stories[activeStoryIndex].mediaUrl}
                className="w-full h-full object-contain"
                autoPlay
              />
            )}
            <p className="absolute top-4 left-4 text-white text-lg font-semibold">
              {groupedStories[activeUserIndex].user.username}
            </p>

            {/* Buttons */}
            <div className="absolute bottom-4 flex gap-6">
              <button
                onClick={handlePrevStory}
                className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
              >
                Prev
              </button>
              <button
                onClick={handleNextStory}
                className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
              >
                Next
              </button>
              <button
                onClick={handleCloseStory}
                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Story;
