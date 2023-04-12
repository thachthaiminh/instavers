const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller')

router.get('/', notificationController.getAll) //lấy tất cả các thông báo(notification) của người dùng từ database
router.put('/', notificationController.updateNotifyStatus) // cập nhật trạng thái của thông báo khi người dùng đã xem thông báo đó.


module.exports = router