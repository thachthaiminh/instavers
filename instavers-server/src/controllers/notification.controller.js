const notificationService = require("../services/notification.service");

async function getAll(req, res, next) {
  try {
    const userId = req.userId
    
    res.json(await notificationService.getAll(userId));
  } catch (err) {
    console.error(`Error get all notify`, err.message);
    next(err);
  }
}

// Hàm getAll dùng để lấy tất cả thông báo của người dùng hiện tại bằng cách truy xuất 
// đến service notificationService và truyền vào userId của người dùng.

async function updateNotifyStatus(req, res, next) {
  try {
    const userId = req.userId
    const data = req.body
    res.json(await notificationService.updateNotifyStatus(userId,data));
  } catch (err) {
    console.error(`Error update notify status`, err.message);
    next(err);
  }
}

// Hàm updateNotifyStatus dùng để cập nhật trạng thái của thông báo. Hàm này cũng truy xuất đến notificationService 
// để cập nhật trạng thái thông báo với userId và dữ liệu data được truyền vào.


module.exports = {
  getAll,
  updateNotifyStatus
};
