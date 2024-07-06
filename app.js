const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const connectToDB = require("./connection/connection");

const User = require("./models/User");
const Posts = require("./models/Posts");

const bcrypt = require("bcrypt");
const { signToken, verifyToken } = require("./jwt/jwt");

connectToDB("mongodb://localhost:27017/miniproject");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isLoggedIn = (req, res, next) => {
  const cookie = req.cookies.token;
  if (!cookie) return res.send("you must be logged in");
  else {
    const data = verifyToken(cookie);
    req.user = data;
    next();
  }
};

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
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

  res.cookie("token", token).redirect("/profile");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const emailExists = await User.findOne({ email });

  if (!emailExists) {
    res.status(404).send("Invalid credentials");
  }

  const verifiedPassword = await bcrypt.compare(password, emailExists.password);
  if (!verifiedPassword) {
    res.status(404).render("login");
  }
  const token = signToken(emailExists._id);
  res.cookie("token", token).redirect("/profile");
});
app.get("/logout", (req, res) => {
  res.cookie("token", "").redirect("/login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  const userData = await User.findById(req.user.id).populate("posts");
  console.log(userData);

  res.render("profile", { userData });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  const postData = await Posts.findById(req.params.id);
  // if post exists or not
  if (postData.likes.indexOf(req.user.id) == -1) {
    postData.likes.push(req.user.id);
  } else {
    postData.likes.splice(postData.likes.indexOf(req.user.id), 1);
  }
  await postData.save();
  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await User.findById(req.user.id);
  const { content } = req.body;
  const post = await Posts.create({
    userId: req.user.id,
    content,
  });
  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const data = await Posts.findById(id).populate("userId");

  res.render("edit", { data });
});

app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const result = await Posts.findByIdAndUpdate(id, { content });
  if (!result) {
    console.log("An error occured while updating");
  }
  res.redirect("/profile");
});

app.listen(3000, (req, res) => {
  console.log("server running");
});
