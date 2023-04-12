const hashtagService = require("../services/hashtag.service");

async function search(req, res, next) {
  try {
    const search = req.params.search
    res.json(await hashtagService.search(search));
  } catch (err) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}

// Đoạn code này xử lý việc tìm kiếm hashtag trong hệ thống.
// Hàm search này lấy thông tin từ parameter search của request và sử dụng hashtagService.search 
// để tìm kiếm các hashtag có chứa từ khóa tương ứng. Sau đó, trả về kết quả thông qua response.


module.exports = {
  search,
};
