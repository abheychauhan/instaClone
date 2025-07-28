import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
          About Me
        </h1>
        <div className="text-gray-700 text-lg leading-relaxed">
          <p className="mb-4">
            👋 Hi, I'm <span className="font-semibold text-indigo-700">Abhey Singh</span>, the creator of this Instagram Clone project. I'm currently pursuing B.Tech in Computer Science & Engineering, and passionate about building full-stack web applications using the latest technologies.
          </p>

          <p className="mb-4">
            🚀 This project was built using the <strong>MERN stack</strong> — MongoDB, Express.js, React.js, and Node.js. It supports features like user authentication, real-time messaging, post creation, likes/comments, follow system, and more.
          </p>

          <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
            💻 Tech Skills
          </h2>
          <ul className="list-disc ml-6">
            <li>Frontend: React.js, Tailwind CSS</li>
            <li>Backend: Node.js, Express.js, Socket.io</li>
            <li>Database: MongoDB, Mongoose</li>
            <li>Dev Tools: Git, GitHub, Render, Cloudinary</li>
            <li>Others: JWT Auth, RESTful APIs, WebSockets</li>
          </ul>

          <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
            📫 Contact
          </h2>
          <p className="mb-2">Email: <span className="text-blue-600">abheys172@gmail.com</span></p>
          <p>GitHub: <a href="https://github.com/abheychauhan/instaClone" className="text-blue-600 hover:underline">https://github.com/abheychauhan</a></p>
        </div>
      </div>
    </div>
  );
};

export default About;
