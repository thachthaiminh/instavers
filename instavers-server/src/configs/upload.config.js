const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/')
    },
  })

  // sử dụng phương thức diskStorage của Multer để lưu trữ file được tải lên vào thư mục "src/public/".
  
  const upload = multer({ storage: storage })
  module.exports = upload

