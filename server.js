
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// Static files serve karega (index.html etc.)
app.use(express.static(__dirname));


// 🔗 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medixqr_db")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// 👤 User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);


// 🟢 SIGNUP API
app.post("/signup", async (req, res) => {
  try {
    const { name, age, phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      phone,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "User Registered Successfully" });

  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});


// 🔵 LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

  res.json({ message: "Login Successful" });
});


// 🚀 Start Server (IMPORTANT CHANGE HERE)
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3000");
});
