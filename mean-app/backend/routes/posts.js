const express = require("express");
const multer = require("multer");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + ":" + ext);
  },
});

const Post = require("../models/post");

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    console.log(post);

    post.save().then((result) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

router.get("", (req, res, next) => {
  let pageSize = +req.query.pageSize;
  let currentPage = +req.query.page;
  let postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    console.log(pageSize);
    console.log(currentPage);
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .find()
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => console.log(err));
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

router.put("/:id", multer(storage).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.title) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful" });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    console.log(post);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

module.exports = router;
