const express = require('express')
const router = express.Router()

const expressJoi = require('@escook/express-joi')

const userinfo_handle = require('../router_handler/userinfo')
router.get('/userinfo', userinfo_handle.getUserinfo)

const { update_userinfo_schema, update_password_schema } = require('../schema/user')
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handle.updateUserinfo)

router.post('/updatePwd', expressJoi(update_password_schema), userinfo_handle.updatePassword)

module.exports = router
