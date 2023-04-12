const { validationResult } = require('express-validator')
const authServices = require('../services/auth.service')

async function getUser(req, res, next) {
    try {
        console.log(`GET USER ${req.params.username}`)
        const username = req.params.username
        const userId = req.userId
        res.json(await authServices.getUser(userId, username))
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message)
        next(err)
    }
}

//Hàm getUser: Hàm này được sử dụng để lấy thông tin của một người dùng dựa trên username được truyền vào.

async function searchUsers(req, res, next) {
    try {
        console.log(req.params)
        const username = req.params.username
        const userId = req.userId
        res.json(await authServices.searchUsers(userId, username))
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message)
        next(err)
    }
}

//Hàm searchUsers: Hàm này được sử dụng để tìm kiếm người dùng dựa trên username được truyền vào.

async function login(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        res.json(await authServices.login(req.body))
    } catch (err) {
        console.error(`Error while login`, err.message)
        next(err)
    }
}

//Hàm login: Hàm này được sử dụng để xử lý request đăng nhập. 
//Hàm này sử dụng hàm validationResult từ thư viện express-validator 
//để kiểm tra tính hợp lệ của các trường dữ liệu được gửi đến từ phía người dùng.

async function signup(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        res.json(await authServices.singup(req.body))
    } catch (err) {
        console.error(`Error while login`, err.message)
        next(err)
    }
}

// Hàm signup: Hàm này được sử dụng để xử lý request đăng ký. Hàm này cũng sử dụng hàm 
// validationResult để kiểm tra tính hợp lệ của các trường dữ liệu được gửi đến từ phía người dùng.

async function update(req, res, next) {
    try {
        const data = req.body
        if (!data.avatar) data.avatar = 'avatar/avatar.png'
        console.log('Upload:', data)
        // res.json("ok")
        const userId = req.userId
        console.log(userId)
        res.json(await authServices.update(userId, data))
    } catch (err) {
        console.error(`Error while update`, err.message)
        next(err)
    }
}

// Hàm update: Hàm này được sử dụng để cập nhật thông tin người dùng.

module.exports = {
    getUser,
    signup,
    login,
    update,
    searchUsers,
}
