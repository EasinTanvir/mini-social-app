const express = require("express");

const protectRoute = require("../middlewares/protectRoute");

const {
  createPostController,
  getPostsController,
  likePostController,
  commentController,
} = require("../controllers/post.controller");

const router = express.Router();

router.post("/", protectRoute, createPostController);

router.get("/", protectRoute, getPostsController);

router.post("/:id/like", protectRoute, likePostController);

router.post("/:id/comment", protectRoute, commentController);

module.exports = router;
