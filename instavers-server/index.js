const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const socketServer = require("./socket-server");

const setupRouter = require("./src/routes");
// const db = require('./src/services/db.service')

const app = express();
const port = process.env.PORT || 3000;

// db.connect()

app.use(cors());

app.use("/static", express.static(path.join(__dirname, "/src/public")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use (
//     bodyParser.urlencoded({
//         extended : true,
//     })
// );
// app.use(bodyParser.json())

setupRouter(app);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:3001",
      "http://localhost:3001",
    ],
    credentials: true,
  },
});
socketServer(io);

// io.on("connection", (socket) => {
//   console.log(`Có người vừa kết nối, socketID: ${socket.id}`);

//   socket.on("following", (data) => {
//     console.log(
//       `id_user: ${data.id_user} vừa follow user có id ${data.id_user_following}`
//     );

//     const data_clone = {
//       id_user: data.id_user_following,
//       id_user_following: data.id_user,
//     };

//     console.log(data_clone);

//     socket.broadcast.emit("show_notification", data_clone);
//   });

//   socket.on("like", (data) => {
//     console.log(
//       `id_user: ${data.id_user} vừa gửi socket tới user có id ${data.id_user_another}`
//     );

//     const data_clone = {
//       id_user: data.id_user_another,
//       id_user_another: data.id_user,
//     };

//     console.log(data_clone);

//     socket.broadcast.emit("show_favorite", data_clone);
//   });

//   // Nhận socket gửi tin nhắn
//   socket.on("send_message", (data) => {
//     //Sau đó nó sẽ update lại database bên phía người nhận
//     //Vì 1 bên gửi 1 bên nhận nên category sẽ đổi thành receive
//     const newData = {
//       id: Math.random().toString(),
//       message: data.message,
//       category: "receive",
//     };

//     const postData = async () => {
//       const message = await ChatModel.findOne({
//         id_user1: data.id_user2,
//         id_user2: data.id_user1,
//       });

//       message.count_message = message.count_message + 1;

//       message.status = false;

//       message.content.push(newData);

//       message.save();
//     };

//     postData();

//     //Xử lý xong server gửi ngược lại client thông qua socket với key receive_message
//     socket.broadcast.emit("receive_message");
//   });
// });

server.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
