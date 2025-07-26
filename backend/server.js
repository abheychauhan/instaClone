const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();


const server = require('http').createServer(app);

const connectDB = async () => {
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

};

connectDB();

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
}); 

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));




app.use('/auth',  require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/msgs', require('./routes/messageRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/stories',require('./routes/storyRoutes'))





io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("getMessage", data);
  });
socket.on("messageSeen", ({ senderId, receiverId }) => {
  io.to(senderId).emit("messageSeen", { senderId, receiverId });
});

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});