const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Post = require("./models/post");

mongoose
  .connect(
    "mongodb+srv://NikitaKornienko:Kornienko130@cluster0.0ht3j.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({ title: req.body.title, content: req.body.content });
  console.log(post);

  post.save();
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.use((req, res, next) => {
  console.log("first Middleware");
  next();
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts sent successfully",
        posts: documents,
      });
    })
    .catch((err) => console.log(err));
});

module.exports = app;
