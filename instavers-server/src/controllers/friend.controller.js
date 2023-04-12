const { validationResult } = require('express-validator')
const friendService = require('../services/friend.service')

async function getFriends(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.get(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}

// Hàm getFriends: Lấy danh sách bạn bè của một người dùng.

async function getNewRequestStatus(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.getNewRequestStatus(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}

// Hàm getNewRequestStatus: Lấy trạng thái yêu cầu kết bạn mới của người dùng.

async function updateNewRequestStatus(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.updateNewRequestStatus(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}

// Hàm updateNewRequestStatus: Cập nhật trạng thái yêu cầu kết bạn mới của người dùng.

async function sugguestFriends(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.sugguestFriends(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}

// Hàm sugguestFriends: Đề xuất danh sách bạn bè cho người dùng.

async function getMentions(req, res, next) {
    try {
        const userId = req.userId
        const search = req.params.search
        res.json(await friendService.getMentions(userId,search))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}

// Hàm getMentions: Lấy danh sách người dùng được đề cập trong tìm kiếm.

async function removeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.params.friendId
        res.json(await friendService.removeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}

// Hàm removeFriend: Xóa một người bạn khỏi danh sách bạn bè của người dùng.

async function makeFriend(req, res, next) {
    try {
        res.json({ data: `Make friend with ${req.body.username}` })
    } catch (err) {
        console.error(`Error while make friend`, err.message)
        next(err)
    }
}

// Hàm makeFriend: Kết bạn với một người dùng khác.

async function unFriend(req, res, next) {
    try {
        res.json({ data: `Unfriend with ${req.body.username}` })
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

// Hàm unFriend: Huỷ kết bạn với một người dùng khác.

async function sendRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.body.friendId
        res.json(await friendService.sendRequestMakeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

// Hàm sendRequestMakeFriend: Gửi yêu cầu kết bạn tới một người dùng khác.

async function removeRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.params.friendId
        console.log('Remove request friend: ', userId, friendId)
        res.json(await friendService.removeRequestMakeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

// Hàm removeRequestMakeFriend: Xóa yêu cầu kết bạn đã gửi đến một người dùng khác.

async function getAllRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.getAllRequestMakeFriend(userId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

// Hàm getAllRequestMakeFriend: Lấy danh sách yêu cầu kết bạn đã gửi và nhận của người dùng.

async function refuseRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.body.friendId
        console.log('Refuse', userId, friendId)
        res.json(await friendService.removeRequestMakeFriend(friendId, userId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

// Hàm refuseRequestMakeFriend: Từ chối yêu cầu kết bạn từ một người dùng khác.

async function acceptRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.body.friendId
        console.log('Accpet', userId, friendId)
        res.json(await friendService.acceptRequestMakeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

// Hàm acceptRequestMakeFriend: Chấp nhận yêu cầu kết bạn từ một người dùng khác.

module.exports = {
    getFriends,
    getMentions,
    sugguestFriends,
    makeFriend,
    removeFriend,
    sendRequestMakeFriend,
    removeRequestMakeFriend,
    getAllRequestMakeFriend,
    refuseRequestMakeFriend,
    acceptRequestMakeFriend,
    unFriend,
    getNewRequestStatus,
    updateNewRequestStatus,
}
