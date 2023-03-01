const bcrypt = require('bcryptjs')
const db = require('../db')

exports.getUserinfo = (req, res) => {
  // console.log(req.user)
  const { id } = req.user
  const getUserinfo_sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
  db.query(getUserinfo_sql, id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('获取用户信息失败！')
    }
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    })
  })
}

exports.updateUserinfo = (req, res) => {
  const update_sql = 'update ev_users set? where id=?'
  db.query(update_sql, [req.body, req.body.id], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('修改用户基本信息失败！')
    }
    return res.cc('修改用户基本信息成功！', 0)
  })
}

exports.updatePassword = (req, res) => {
  let { id } = req.user
  let { oldPwd, newPwd } = req.body
  const get_user_sql = 'select * from ev_users where id=?'
  db.query(get_user_sql, id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('用户不存在！')
    }
    const compareResult = bcrypt.compareSync(oldPwd, results[0].password)
    if (!compareResult) {
      return res.cc('原密码错误！ ')
    }
    newPwd = bcrypt.hashSync(newPwd, 10)
    const update_password_sql = 'update ev_users set ? where id=?'
    db.query(update_password_sql, [{ password: newPwd }, id], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        return res.cc('更新密码失败！')
      }
      res.cc('修改密码成功！', 0)
    })
  })
}
