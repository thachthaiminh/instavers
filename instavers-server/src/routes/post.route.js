const express = require("express");
const upload = require("../configs/upload.config");
const router = express.Router();
const postController = require("../controllers/post.controller");

router.get("/", postController.get);
router.get("/friend", postController.getFriend); //lấy bài đăng của bạn bè.
router.post("/", postController.create); //tạo bài đăng mới.
router.get("/liked", postController.getLikedPosts); //lấy tất cả bài đăng đã được thích.
router.get("/mentioned", postController.getMentionedPosts); //lấy tất cả bài đăng đã được đề cập đến.
router.get("/:postId", postController.getById); 
router.delete("/:postId", postController.remove);

router.post("/msg", async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const newmessage = await MessageChannel.create({
      message: message,
      Chatuser: [from, to],
      Sender: from,
    });
    return res.status(200).json(newmessage);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

//gửi bl giữa hai người dùng.

router.get("/get/chat/msg/:user1Id/:user2Id", async (req, res) => {
  try {
    const from = req.params.user1Id;
    const to = req.params.user2Id;

    const newmessage = await Message.find({
      Chatuser: {
        $all: [from, to],
      },
    });
    const allmessage = newmessage.map((msg) => {
      return {
        myself: msg.Sender.toString() === from,
        message: msg.message,
      };
    });

    return res.status(200).json(allmessage);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

//lấy tất cả tin nhắn giữa hai người dùng

module.exports = router;
