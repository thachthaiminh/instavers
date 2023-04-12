const express = require("express");
const { body, check, validationResult } = require("express-validator");
const router = express.Router();

const friendController = require("../controllers/friend.controller");

router.get("/", friendController.getFriends); // Lấy danh sách bạn bè
router.get("/status", friendController.getNewRequestStatus); // Lấy trạng thái yêu cầu kết bạn mới
router.put("/status", friendController.updateNewRequestStatus); // Cập nhật trạng thái yêu cầu kết bạn mới
router.get("/suggest", friendController.sugguestFriends); // Đề xuất bạn bè
router.get("/mentions/:search", friendController.getMentions); // Tìm kiếm bạn bè để đề cập
router.delete("/:friendId", friendController.removeFriend); // Xóa bạn bè
router.post("/refuse", friendController.refuseRequestMakeFriend); // Từ chối yêu cầu kết bạn
router.post("/accept", friendController.acceptRequestMakeFriend); // Chấp nhận yêu cầu kết bạn
router.get("/invite", friendController.getAllRequestMakeFriend); // Lấy danh sách yêu cầu kết bạn
router.post("/invite", friendController.sendRequestMakeFriend); // Gửi yêu cầu kết bạn
router.delete("/invite/:friendId", friendController.removeRequestMakeFriend); // Xóa yêu cầu kết bạn
router.post(
"/", // Yêu cầu kết bạn
body("username", "Username is not empty").isString().notEmpty(),
friendController.makeFriend
);
router.delete(
"/", // Hủy kết bạn
body("username", "Username is not empty").isString().notEmpty(),
friendController.unFriend
);
module.exports = router;