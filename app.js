const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const connectToDB = require("./connection/connection");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const { signToken, verifyToken } = require("./jwt/jwt");

connectToDB("mongodb://localhost:27017/miniproject");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res, next) => {
  const { username, email, age, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(404).json({ msg: "User already exists" });
  }
  const createUser = await User.create({ username, email, age, password });
  if (!createUser) {
    res.status(404).send("Error createing user");
  }
  const token = signToken(createUser._id);

  if (!token) {
    res.status(404).send("Error generating token");
  }

  res.send(createUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailExists = await User.findOne({ email });

  if (!emailExists) {
    res.status(404).send("Invalid credentials");
  }

  const verifiedPassword = await bcrypt.compare(password, emailExists.password);
  if (!verifiedPassword) {
    res.status(404).send("Invalid credentials");
  } else {
    const verifiedToken = signToken(emailExists._id);
    res.cookie("token", verifiedToken).send("login successful");
  }
});

app.listen(3000, (req, res) => {
  console.log("server running");
});
