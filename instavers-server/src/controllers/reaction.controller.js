const reactionServices = require("../services/reaction.service");
const helpers = require('../utils/helper.util')

async function like(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await reactionServices.like(userId, postId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}

// Hàm like xử lý yêu thích bài đăng của người dùng, nó lấy ra userId và postId từ request parameter 
// và sử dụng reactionServices.like để thực hiện phản ứng yêu thích và trả về kết quả.

async function unlike(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await reactionServices.unlike(userId, postId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}

// Hàm unlike xử lý hủy thích bài đăng của người dùng, nó lấy ra userId và postId từ request parameter 
// và sử dụng reactionServices.unlike để thực hiện phản ứng hủy thích và trả về kết quả.

module.exports = {
    like,
    unlike
}
