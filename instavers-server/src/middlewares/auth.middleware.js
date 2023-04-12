const jwt = require("jsonwebtoken");
const secret = require("../configs/jwt.config");

const authServices = require("../services/auth.service");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decode = jwt.verify(token, secret);
    req.username = decode.username;
    req.userId = decode.id;
    next();
  } catch (error) {
    res.status(500).send("Verify token is failed");
    return;
  }
};

// "verifyToken" được sử dụng để xác thực token trong phần header của request 
// và giải mã token để lấy ra thông tin user gửi request.

const checkExistUsername = async (req, res, next) => {
  const username = req.body.username;
  try {
    const user = await authServices.searchExistUsers(username);

    if (user) {
      console.log("Username is already existing! SIGNUP");
      res.status(500).send({ message: "Username is already existing!" });
      return;
    }
    next();
  } catch (error) {
    console.log("Error in checkExistUsername");
    res.status(500).send({ message: "Error in checkExistUsername" });
    return;
  }
};

// "checkExistUsername" được sử dụng để kiểm tra xem username có tồn tại 
// trong hệ thống hay không trước khi tạo mới user.

module.exports = { verifyToken, checkExistUsername };
