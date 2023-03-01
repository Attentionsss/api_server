const joi = require('joi')

const username = joi.string().alphanum().min(1).max(10).required()
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required()

exports.reg_login_schema = {
  body: {
    username,
    password,
  },
}

const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email,
  },
}
// 验证规则对象 - 重置密码
exports.update_password_schema = {
  body: {
    oldPwd: password,
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}
