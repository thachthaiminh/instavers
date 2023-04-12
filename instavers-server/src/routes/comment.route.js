const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller')

router.post('/', commentController.add)
router.get('/:postId', commentController.get)

// thêm bình luận mới và lấy tất cả bình luận của một bài đăng cụ thể.

module.exports = router