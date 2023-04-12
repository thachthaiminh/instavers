const db = require('./db.service')
const commentService = require('./comment.service')
const helper = require('../utils/helper.util')
const fs = require('fs')

//Lấy danh sách các hình ảnh liên quan đến một bài đăng
async function getImages(postId) {
    const rows = await db.query(
        `select image.image_id, image.image_url  from image, post
        where image.post_id=post.post_id and image.post_id=?`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    return {
        data,
    }
}

//Lấy thông tin hình ảnh đầu tiên liên quan đến một bài đăng 
async function getFirstImage(postId) {
    const rows = await db.query(
        `select image.image_id, image.image_url  from image
        where image.post_id=?`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    return {
        data: data[0],
    }
}

// Thêm một hình ảnh mới vào một bài đăng cụ thể
async function addImages(postId, imageUrl) {
    const rows = await db.query(`INSERT INTO image (post_id, image_url) VALUES ( ? , ?)`, [
        postId,
        imageUrl,
    ])
    const data = helper.emptyOrRows(rows)

    return {
        data,
    }
}

//Xóa tất cả các hình ảnh liên quan đến một bài đăng cụ thể
async function deleteAll(postId) {
    await db.query(`DELETE FROM image WHERE image.post_id = ?`, [postId])

    return {
        message: 'Delete all images successfully',
    }
}

module.exports = {
    getImages,
    addImages,
    deleteAll,
    getFirstImage,
}
