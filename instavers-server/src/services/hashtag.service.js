const db = require('./db.service');
const helper = require('../utils/helper.util');

//tìm kiếm các hashtag trong cơ sở dữ liệu
async function search(search){
  const rows = await db.query(
    `select * from hashtag where hashtag.hashtag_name like '${search}%'`,
  );
  const data = helper.emptyOrRows(rows);

  return {
    data,
  }
}

//thêm một hashtag mới vào cơ sở dữ liệu
async function addHashtag(commentId, hashtagId) {
  await db.query(`INSERT INTO have_hashtag (hashtag_id, comment_id) VALUES (?, ?)`, [hashtagId, commentId])
  return {
      message: 'Add hashtag successfully!',
  }
}

//xóa tất cả các hashtag của một comment khỏi cơ sở dữ liệu
async function deleteAll(commentId) {
  await db.query(`DELETE FROM have_hashtag WHERE have_hashtag.comment_id = ?` , [
      commentId,
  ])
  return {
      message: 'Delete all hashtag successfully!',
  }
}

module.exports = {
  search,
  addHashtag,
  deleteAll,
}