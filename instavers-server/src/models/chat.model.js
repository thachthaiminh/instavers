const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id_user1: String,
  id_user2: String,
  content: Array,
  count_message: Number,
});

const Chat = mongoose.model("Chat", schema, "chat");

module.exports = Chat;
