const postServices = require("../services/post.service");
// const fs = require("node:fs");
const helpers = require('../utils/helper.util')

async function get(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getAllPosts(userId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}

// Hàm get: lấy tất cả các bài đăng của người dùng, 
// yêu cầu đăng nhập và sử dụng userId để xác định người dùng.

async function getFriend(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getFriendPosts(userId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}

// Hàm getFriend: lấy tất cả các bài đăng của bạn bè của người dùng.

async function getById(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await postServices.getById(userId,postId));
  } catch (err) {
    console.error(`Error while get posts by Id`, err.message);
    next(err);
  }
}

// Hàm getById: lấy bài đăng theo postId được xác định và userId để xác định người dùng.

async function create(req, res, next) {
  try {
    req.userId = req.userId
    const images = req.body.images;
    const captionData = req.body.captionData;
    const aspect = helpers.getAspect(req.body.aspect);

    console.log("Caption data:", captionData);
    console.log("IMAGES URL:", images);
    await postServices.create(req.userId,images, captionData, aspect)
    res.json({ data: { message: "Create the post successfully!" } });
  } catch (err) {
    console.error(`Error `, err.message);
    next(err);
  }
}

// Hàm create: tạo một bài đăng mới. Hàm này yêu cầu images (hình ảnh), 
// captionData (nội dung bài đăng), và aspect để tạo bài đăng mới.

async function remove(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await postServices.remove(userId,postId));
  } catch (err) {
    console.error(`Error while get posts by Id`, err.message);
    next(err);
  }
}


// Hàm remove: xóa một bài đăng đã đăng bởi người dùng.

async function getLikedPosts(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getLikedPosts(userId));
  } catch (err) {
    console.error(`Error while get liked posts`, err.message);
    next(err);
  }
}

// Hàm getLikedPosts: lấy tất cả các bài đăng mà người dùng đã thích.

async function getMentionedPosts(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getMentionedPosts(userId));
  } catch (err) {
    console.error(`Error while get mentioned posts`, err.message);
    next(err);
  }
}

// Hàm getMentionedPosts: lấy tất cả các bài đăng mà người dùng đã được đề cập đến.

module.exports = {
  get,
  getById,
  create,
  remove,
  getLikedPosts,
  getMentionedPosts,
  getFriend,
};
