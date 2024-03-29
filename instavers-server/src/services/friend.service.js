const db = require('./db.service')
const helper = require('../utils/helper.util')

//get(userId): Lấy danh sách bạn bè của một người dùng dựa trên userId.
async function get(userId) {
    const rows = await db.query(
        `SELECT users.user_id, users.user_name, users.user_fullname, users.user_avatar FROM friend,users WHERE friend.user_id_2 = users.user_id and friend.user_id_1 = ?`,
        [userId]
    )
    const data = helper.emptyOrRows(rows)
    return {
        data,
    }
}
//getNewRequestStatus(userId): Lấy trạng thái yêu cầu kết bạn mới của một người dùng dựa trên userId.
async function getNewRequestStatus(userId) {
    const rows = await db.query(
        `SELECT * FROM friend_invitation WHERE user_invite = ? and is_seen = 0`,
        [userId]
    )
    const data = helper.emptyOrRows(rows)
    let newRequest = true
    if (data.length === 0) newRequest = false
    return {
        data: newRequest,
    }
}

//updateNewRequestStatus(userId): Cập nhật trạng thái yêu cầu kết bạn mới của một người dùng dựa trên userId.
async function updateNewRequestStatus(userId) {
    await db.query(
        `UPDATE friend_invitation SET is_seen = 1 where user_invite = ?`,
        [userId]
    )
    return {
        message: "Update new request status successfully",
    }
}

//sugguestFriends(userId): Đề xuất danh sách bạn bè tiềm năng cho một người dùng dựa trên userId.
async function sugguestFriends(userId) {
    const rows = await db.query(
        `SELECT users.user_id, users.user_name, users.user_fullname, users.user_avatar FROM users WHERE user_id<> ?
        and user_id not in(
        SELECT friend.user_id_2 FROM friend WHERE friend.user_id_1 = ?
        UNION
        SELECT friend_invitation.user_invite FROM friend_invitation WHERE friend_invitation.user_id = ? 
        UNION
            SELECT friend_invitation.user_id FROM friend_invitation WHERE friend_invitation.user_invite = ?   
        )
        ORDER BY RAND()
         LIMIT 5`,
        [userId, userId, userId, userId]
    )
    const data = helper.emptyOrRows(rows)
    return {
        data,
    }
}

//getMentions(userId, search): Lấy danh sách những người được đề cập trong bình luận 
//của một người dùng dựa trên userId và từ khóa tìm kiếm search.
async function getMentions(userId, search) {
    const rows = await db.query(
        `SELECT users.user_id, users.user_name, users.user_avatar FROM friend,users WHERE friend.user_id_2 = users.user_id and friend.user_id_1 = ? and users.user_name like '${search}%'`,
        [userId]
    )
    const data = helper.emptyOrRows(rows)
    return {
        data,
    }
}

//removeFriend(userId, friendId): Xóa một bạn bè của một người dùng dựa trên userId và friendId.
async function removeFriend(userId, friendId) {
    await db.query(
        `DELETE FROM friend WHERE (friend.user_id_1 = ? AND friend.user_id_2 = ?) OR (friend.user_id_2 = ? AND friend.user_id_1 = ?)`,
        [userId, friendId, userId, friendId]
    )
    return {
        message: 'Remove friend successfully!',
    }
}

//sendRequestMakeFriend(userId, friendId): Gửi yêu cầu kết bạn mới từ một người dùng dựa trên userId 
//đến một người dùng khác dựa trên friendId.
async function sendRequestMakeFriend(userId, friendId) {
    await db.query(`INSERT INTO friend_invitation (user_id, user_invite) VALUES (?, ?)`, [
        userId,
        friendId,
    ])
    return {
        message: 'Send the request to make friend successfully!',
    }
}

//removeRequestMakeFriend(userId, friendId): Xóa yêu cầu kết bạn mới từ một người dùng 
//dựa trên userId đến một người dùng khác dựa trên friendId.
async function removeRequestMakeFriend(userId, friendId) {
    await db.query(
        `DELETE FROM friend_invitation WHERE friend_invitation.user_id = ? AND friend_invitation.user_invite = ?`,
        [userId, friendId]
    )
    // const data = helper.emptyOrRows(rows);
    return {
        message: 'Remove the request to make friend successfully!',
    }
}

//getAllRequestMakeFriend(userId): Lấy tất cả các yêu cầu kết bạn mới của một người dùng dựa trên userId.
async function getAllRequestMakeFriend(userId) {
    const rows = await db.query(
        `SELECT users.user_id, users.user_name, users.user_fullname, users.user_avatar, users.user_id FROM friend_invitation, users WHERE friend_invitation.user_id = users.user_id AND user_invite = ?`,
        [userId]
    )
    const data = helper.emptyOrRows(rows)
    return {
        data,
    }
}

//acceptRequestMakeFriend(userId, friendId): Chấp nhận yêu cầu kết bạn mới từ một người dùng 
//dựa trên userId của một người dùng khác dựa trên friendId.
async function acceptRequestMakeFriend(userId, friendId) {
    //Delete reuest make friend from friendId
    await removeRequestMakeFriend(friendId, userId)
    await db.query(`INSERT INTO friend (user_id_1, user_id_2) VALUES (?, ?)`, [userId, friendId])
    await db.query(`INSERT INTO friend (user_id_1, user_id_2) VALUES (?, ?)`, [friendId, userId])
    return {
        message: 'Accept friend successfully!',
    }
}

//addMention(commentId, friendId): Thêm một người dùng được đề cập trong một bình luận 
//dựa trên commentId và friendId.
async function addMention(commentId, friendId) {
    await db.query(`INSERT INTO mentions (comment_id, mention_user_id) VALUES (?, ?)`, [
        commentId,
        friendId,
    ])
    return {
        message: 'Add mention friend successfully!',
    }
}

//deleteAll(commentId): Xóa tất cả những người được đề cập trong một bình luận dựa trên commentId.
async function deleteAll(commentId) {
    await db.query(`DELETE FROM mentions WHERE mentions.comment_id = ?`, [commentId])
    return {
        message: 'Delete all mention friend successfully!',
    }
}

//getTotalOfUserId(userId): Lấy tổng số bạn bè của một người dùng dựa trên userId.
async function getTotalOfUserId(userId) {
    const rows = await db.query(`select count(*) as count from friend where friend.user_id_1 = ?`, [
        userId,
    ])
    const data = helper.emptyOrRows(rows)
    return data[0].count
}

module.exports = {
    get,
    getMentions,
    removeFriend,
    sugguestFriends,
    sendRequestMakeFriend,
    removeRequestMakeFriend,
    getAllRequestMakeFriend,
    acceptRequestMakeFriend,
    addMention,
    getTotalOfUserId,
    deleteAll,
    getNewRequestStatus,
    updateNewRequestStatus,
}
