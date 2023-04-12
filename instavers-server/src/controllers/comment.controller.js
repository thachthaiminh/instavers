const commentService = require("../services/comment.service");

async function add(req, res, next) {
  try {
    const userId = req.userId
    const {postId, captionData, replyId} = req.body
    console.log("ADD COMMENT",req.body);
    res.json(await commentService.add(userId, postId, captionData,replyId));
  } catch (err) {
    console.error(`Error while add comment`, err.message);
    next(err);
  }
}

// "add" sẽ được gọi khi có request để thêm một bình luận mới vào một bài đăng. 
// Nó sẽ lấy thông tin người dùng từ req.userId và các thông tin cần thiết để thêm bình luận từ req.body, 
// sau đó gọi tới service để thêm bình luận và trả về kết quả thông qua res.json.

async function get(req, res, next) {
  try {
    const {postId} = req.params
    res.json(await commentService.getComments(postId));
  } catch (err) {
    console.error(`Error while add comment`, err.message);
    next(err);
  }
}

// "get" sẽ được gọi khi có request để lấy danh sách các bình luận của một bài đăng. 
// Nó sẽ lấy thông tin postId từ req.params 
// và gọi tới service để lấy danh sách bình luận và trả về kết quả thông qua res.json.


module.exports = {
  add,
  get
};
