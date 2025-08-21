require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (no deprecated options)
mongoose
.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const port = process.env.PORT || 5000;
    server.listen(port, () =>
      console.log(`🚀 Server + Socket.io on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log("POST /auth/register", req.body);
    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ error: "Registration failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("POST /auth/login", req.body);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Could not fetch users" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Could not fetch user" });
  }
});

// Socket.io handlers
io.on("connection", (socket) => {
  console.log("🔌 client connected:", socket.id);

  socket.on("message:send", (msg) => {
    // For now, just broadcast to all clients
    io.emit("message:new", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔌 client disconnected:", socket.id);
  });
});
