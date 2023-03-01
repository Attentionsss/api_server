const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.regUser = (req, res) => {
  let { username, password } = req.body
  if (!username || !password) {
    return res.cc('用户名或密码不合法')
  }
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, [username], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('用户名被占用，请选择其他用户名')
    }
  })

  password = bcrypt.hashSync(password, 10)

  const reg_sql = 'insert into ev_users set ?'
  // const userinfo = { ...req.body, email: '', user_pic: '' }
  db.query(reg_sql, [{ username, password }], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('注册用户失败')
    }
    res.cc('用户注册成功', 0)
  })
  // console.log(username, password)
  console.log(username, password)
}

exports.login = (req, res) => {
  const { username, password } = req.body
  const login_sql = 'select * from ev_users where username=?'
  db.query(login_sql, username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('登录失败')
    }
    const compareResult = bcrypt.compareSync(password, results[0].password)
    if (!compareResult) {
      return res.cc('登录失败！')
    }
    const user = { ...results[0], password: '', user_pic: '' }
    const config = require('../config')
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '5000h' })

    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    })
  })
}
