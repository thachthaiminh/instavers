const express = require("express");
const upload = require("../configs/upload.config");
const router = express.Router();
const postController = require("../controllers/post.controller");

router.get("/", postController.get);
router.get("/friend", postController.getFriend);
router.post("/", postController.create);
router.get("/liked", postController.getLikedPosts);
router.get("/mentioned", postController.getMentionedPosts);
router.get("/:postId", postController.getById);
router.delete("/:postId", postController.remove);

//tạo message
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

module.exports = router;
