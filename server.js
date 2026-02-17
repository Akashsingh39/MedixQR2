
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medixqr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));


// 👤 User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);


// 🟢 SIGNUP API
app.post("/signup", async (req, res) => {
  try {
    const { name, age, phone, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      phone,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "✅ User Registered Successfully" });

  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


// 🔵 LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    res.json({ message: "✅ Login Successful" });

  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


// 🚀 Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


