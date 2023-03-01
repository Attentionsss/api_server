const express = require('express')
const router = express.Router()

const userHandler = require('../router_handler/user')

const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

//用户注册
router.post('/regUser', expressJoi(reg_login_schema), userHandler.regUser)
//用户登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)
module.exports = router
