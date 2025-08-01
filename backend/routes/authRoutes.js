const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        console.log(email)
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }


        // pass encrption
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed password:", hashedPassword);
        const newUser = new User({ 
            username,
            email, 
            password:hashedPassword });
        await newUser.save();
        console.log("User registered successfully");
        res.status(201).json({ message: 'User registered successfully',user: { id: newUser._id, username: newUser.username, email: newUser.email } });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, 
            sameSite: "None", 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message  });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Password verification
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        console.log(user)
        const token = jwt.sign({ id: user._id }, "abhey", { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, 
            sameSite: "none", 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log("token",token)

        res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email , bio: user.bio , avatar:user.avartar } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // only if using https
    sameSite: "None", // for cross-site cookies on mobile
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;


module.exports = router;