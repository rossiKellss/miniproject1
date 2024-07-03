const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const connectToDB = require("./connection/connection");

connectToDB("mongodb://localhost:27017/miniproject");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, (req, res) => {
  console.log("server running");
});
